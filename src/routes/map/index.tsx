import { createFileRoute } from "@tanstack/react-router";
import z from "@zod/zod";
import type { LatLngBounds, LatLngExpression } from "leaflet";
import { InfoIcon, LocateFixedIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Button, LinkButton } from "@/components/ui/button";
import { DayhomeMap } from "@/features/dayhomes/dayhome_map/dayhome_map";
import { DayhomeSheetPreview } from "@/features/dayhomes/dayhome_map/dayhome_sheet_preview";
import {
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
  validateSearch: z.object({
    ...searchParamSchema.shape,
  }),
  head: () => ({
    meta: [
      { title: "Edmonton's childcare map" },
      {
        name: "description",
        content:
          "Find and contact Edmonton daycares, dayhomes, and out-of-school care facilities.",
      },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { l, f, filters } = Route.useSearch();
  const navigate = Route.useNavigate();

  const [bounds, _setBounds] = useState<LatLngBounds | null>(null);
  const sheetRef = useRef<{ open: () => void; close: () => void }>(null);
  const mapRef = useRef<{
    panTo: (latLng: LatLngExpression, zoom: number) => void;
    locate: () => void;
  }>(null);

  const { data: dayhomes } = useListDayhomes({
    boundingBox: bounds
      ? {
          min: { latitude: bounds.getSouth(), longitude: bounds.getWest() },
          max: { latitude: bounds.getNorth(), longitude: bounds.getEast() },
        }
      : undefined,
    filters: filters,
  });

  const dismissSheet = () => {
    sheetRef.current?.close();
  };

  const handleSelect = (id: string) => {
    sheetRef.current?.open();
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
            <InfoIcon />
          </LinkButton>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => mapRef.current?.locate()}
            >
              <LocateFixedIcon />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                mapRef.current?.panTo(
                  { lat: EDMONTON.latitude, lng: EDMONTON.longitude },
                  12,
                )
              }
            >
              Edmonton
            </Button>
          </div>

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
        {f && <DayhomeSheetPreview ref={sheetRef} dayhomeId={f} />}
      </div>
    </div>
  );
}
