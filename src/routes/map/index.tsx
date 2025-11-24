import { Button, LinkButton } from "@/components/ui/button";
import { DayhomeSheetPreview } from "@/features/dayhomes/dayhome_map/dayhome_sheet_preview";
import {
  FilterModal,
  filterModalSearchSchema,
} from "@/features/dayhomes/dayhome_map/filter_modal";
import { InnerMap, MapView } from "@/features/dayhomes/dayhome_map/map_view";
import { MapViewProvider } from "@/features/dayhomes/dayhome_map/map_view_provider.tsx";
import { ProfileAvatar } from "@/lib/auth/profile_avatar";
import { EDMONTON } from "@/lib/geocoding/constant_data";
import type { LatLng } from "@/lib/geocoding/types";
import { createFileRoute } from "@tanstack/react-router";
import z from "@zod/zod";
import type { LatLngExpression } from "leaflet";
import { InfoIcon, LocateFixedIcon } from "lucide-react";
import { useRef } from "react";

const searchParamSchema = z.object({
  /** Location details */
  l: z.string().optional(),
  /** Facility id*/
  f: z.string().optional(),
  filters: filterModalSearchSchema.optional(),
});

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
          "Find Edmonton daycares, dayhomes, and out-of-school care facilities.",
      },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();

  const sheetRef = useRef<{ open: () => void; close: () => void }>(null);

  const mapRef = useRef<{
    panTo: (latLng: LatLngExpression, zoom: number) => void;
    locate: () => void;
  }>(null);

  const dismissSheet = () => {
    sheetRef.current?.close();
  };

  const handleSelect = (id: string) => {
    sheetRef.current?.open();
    navigate({
      search: (prev) => ({ ...prev, f: id }),
    });
  };

  const handleMoveEnd = async ({
    center,
    zoom,
  }: {
    center: LatLng;
    zoom: number;
  }) => {
    const l = `${center.latitude},${center.longitude},${zoom}`;
    await navigate({ search: (prev) => ({ ...prev, l }) });
  };

  return (
    <MapViewProvider
      selectMarker={handleSelect}
      dismissSheet={dismissSheet}
      onMoveEnd={handleMoveEnd}
    >
      <h1 className="sr-only">Edmonton's Childcare Map</h1>
      <div>
        <MapView>
          <InnerMap ref={mapRef} />
        </MapView>

        <div className="fixed top-0 left-1/2 -translate-x-1/2 mt-3 max-w-lg w-full px-2">
          <div className="flex gap-4 justify-between items-center">
            <div className="flex items-center rounded-full bg-white py-0.5 px-0.75 gap-1.5">
              <LinkButton className="rounded-full" to="/info" variant="ghost">
                <InfoIcon />
              </LinkButton>

              <ProfileAvatar navigate />
            </div>

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
              onOpenStart={dismissSheet}
              onFilterChange={(filters) =>
                navigate({
                  search: (prev) => ({ ...prev, filters }),
                })
              }
            />
          </div>
        </div>

        <div className="fixed bottom-0 w-full mx-2">
          <DayhomeSheetPreview ref={sheetRef} />
        </div>
      </div>
    </MapViewProvider>
  );
}
