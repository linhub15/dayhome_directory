import { createFileRoute } from "@tanstack/react-router";
import z from "@zod/zod";
import type { LatLngBounds } from "leaflet";
import { HomeIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Button, LinkButton } from "@/components/ui/button";
import { DayhomeMap } from "@/features/dayhomes/dayhome_map/dayhome_map";
import { DayhomeSheetPreview } from "@/features/dayhomes/dayhome_map/dayhome_sheet_preview";
import {
  type AgeGroupKey,
  FilterModal,
  filterModalSearchSchema,
} from "@/features/dayhomes/dayhome_map/filter_modal";
import { useListDayhomes } from "@/features/dayhomes/dayhome_map/use_list_dayhomes";
import { EDMONTON } from "@/lib/geocoding/constant_data";
import type { LatLng } from "@/lib/geocoding/types";

const searchParamSchema = z.object({
  /** Location details */
  l: z.string().optional(),
  /** Facility id*/
  f: z.string().optional(),
  filters: filterModalSearchSchema.optional(),
});

const zMapStateFromSearch = z
  .string()
  .optional()
  .transform((s) => {
    if (!s) return;
    const [latitude, longitude, zoom] = s.split(",");
    return {
      latitude: Number(latitude),
      longitude: Number(longitude),
      zoom: Number(zoom),
    };
  });

const defaultCenter = { ...EDMONTON, zoom: 11 };

export const Route = createFileRoute("/map/")({
  ssr: "data-only",
  component: RouteComponent,
  validateSearch: z.object({
    ...searchParamSchema.shape,
  }),
});

function RouteComponent() {
  const { l, f, filters } = Route.useSearch();
  const navigate = Route.useNavigate();

  const [bounds, _setBounds] = useState<LatLngBounds | null>(null);
  const [sheetDismissed, setSheetDismissed] = useState(false);
  const mapRef = useRef<{ locate: () => void }>(null);

  // todo: refactor this into it's own hook and context to be shared deeper
  const { data } = useListDayhomes({
    boundingBox: bounds
      ? {
          min: { latitude: bounds.getSouth(), longitude: bounds.getWest() },
          max: { latitude: bounds.getNorth(), longitude: bounds.getEast() },
        }
      : undefined,
  });

  const dayhomes = data
    ?.filter((item) => {
      if (!filters) return true;
      return filters.onlyLicensed ? item.isLicensed : true;
    })
    .filter((item) => {
      if (!filters || !filters.ageGroups) return true;

      const filteredAgeGroups = Object.entries(filters.ageGroups!)
        .filter(([, v]) => v)
        .map(([k]) => k as AgeGroupKey);

      if (!filteredAgeGroups.length) return true;

      return item.ageGroups?.some((ag) => filteredAgeGroups.includes(ag));
    });

  const dismissSheet = () => {
    setSheetDismissed(true);
  };

  const handleSelect = (id: string) => {
    setSheetDismissed(false);
    navigate({ search: (prev) => ({ ...prev, f: id }) });
  };

  const handleMoveEnd = async ({
    center,
    zoom,
  }: {
    center: LatLng;
    zoom: number;
    bounds: LatLngBounds;
  }) => {
    // setBounds(bounds);
    const atParam = `${center.latitude},${center.longitude},${zoom}`;
    await navigate({
      search: (prev) => ({ ...prev, l: atParam }),
      replace: true,
    });
  };

  const mapState = zMapStateFromSearch.parse(l);
  const initialCenter =
    (mapState
      && ({
        latitude: mapState.latitude!,
        longitude: mapState.longitude!,
      } satisfies LatLng))
    ?? defaultCenter;

  return (
    <div>
      <div>
        <DayhomeMap
          ref={mapRef}
          center={initialCenter}
          items={dayhomes ?? []}
          onMoveEnd={handleMoveEnd}
          onSelect={handleSelect}
          onDragStart={dismissSheet}
        />
      </div>

      <div className="fixed top-0 left-1/2 -translate-x-1/2 mt-4 max-w-lg w-full px-2">
        <div className="flex gap-4 justify-between">
          <LinkButton to="/home" variant="outline">
            <HomeIcon />
          </LinkButton>

          <Button variant="outline" onClick={() => mapRef.current?.locate()}>
            Use my location
          </Button>

          <FilterModal
            filters={filters}
            onOpenStart={dismissSheet}
            onFilterChange={(filters) =>
              navigate({
                search: (prev) => ({ ...prev, filters: filters }),
              })
            }
          />
        </div>
      </div>

      <div className="fixed bottom-0 w-full mx-2">
        {f && (
          <DayhomeSheetPreview isDismissed={sheetDismissed} dayhomeId={f} />
        )}
      </div>
    </div>
  );
}
