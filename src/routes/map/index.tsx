import { DayhomeList } from "@/features/dayhomes/dayhome_map/dayhome_list";
import { DayhomeMap } from "@/features/dayhomes/dayhome_map/dayhome_map";
import { useListDayhomes } from "@/features/dayhomes/dayhome_map/use_list_dayhomes";
import {
  DayhomeSearch,
  filterSearchParams,
} from "@/features/dayhomes/dayhome_search";
import { geocodeFn } from "@/lib/geocoding/geocode.fn";
import { createFileRoute } from "@tanstack/react-router";
import { LatLngBounds } from "leaflet";
import { useState } from "react";

export const Route = createFileRoute("/map/")({
  ssr: "data-only",
  component: RouteComponent,
  validateSearch: filterSearchParams,
  loaderDeps: ({ search: { postalCode } }) => ({ postalCode: postalCode }),
  loader: async ({ deps: { postalCode } }) => {
    const geocode = await geocodeFn({ data: { query: postalCode } });
    return { geocode };
  },
});
function RouteComponent() {
  const { geocode } = Route.useLoaderData();
  const { postalCode } = Route.useSearch();

  const initialCenter = geocode ??
    { latitude: 53.4892, longitude: -113.565081 };
  const [bounds, setBounds] = useState<LatLngBounds | null>(null);

  const { data } = useListDayhomes({
    boundingBox: bounds
      ? {
        min: { latitude: bounds.getSouth(), longitude: bounds.getWest() },
        max: { latitude: bounds.getNorth(), longitude: bounds.getEast() },
      }
      : undefined,
  });

  return (
    <div className="">
      <div className="">
        <DayhomeMap
          center={initialCenter}
          items={data ?? []}
          onBoundsChange={setBounds}
        />
      </div>

      <div className="fixed top-0 left-1/2 -translate-x-1/2 mt-4 max-w-xs w-full px-2">
        <DayhomeSearch value={postalCode} />
      </div>

      <div className="fixed bottom-0 w-full mx-2">
        <DayhomeList items={data ?? []} />
      </div>
    </div>
  );
}
