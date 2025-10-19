import { LinkButton } from "@/components/ui/button";
import { DayhomeMap } from "@/features/dayhomes/dayhome_map/dayhome_map";
import { DayhomeSheetPreview } from "@/features/dayhomes/dayhome_map/dayhome_sheet_preview";
import { useListDayhomes } from "@/features/dayhomes/dayhome_map/use_list_dayhomes";
import {
  DayhomeSearch,
  filterSearchParams,
} from "@/features/dayhomes/dayhome_search";
import { EDMONTON } from "@/lib/geocoding/constant_data";
import { geocodeFn } from "@/lib/geocoding/geocode.fn";
import type { LatLng } from "@/lib/geocoding/types";
import { createFileRoute } from "@tanstack/react-router";
import type { LatLngBounds } from "leaflet";
import { useState } from "react";
import z from "zod";

const searchParamSchema = z.object({
  /** Location details */
  l: z.string().optional(),
  /** Facility id*/
  f: z.string().optional(),
});

const zMapStateFromSearch = z.string().optional().transform((s) => {
  if (!s) return;
  const [latitude, longitude, zoom] = s?.split(",");
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
    ...filterSearchParams.shape,
  }),
  loaderDeps: ({ search: { postalCode } }) => ({ postalCode: postalCode }),
  loader: async ({ deps: { postalCode } }) => {
    const geocode = await geocodeFn({ data: { query: postalCode } });
    return { geocode };
  },
});

function RouteComponent() {
  const { geocode } = Route.useLoaderData();
  const { postalCode, l, f } = Route.useSearch();
  const navigate = Route.useNavigate();

  const [bounds, setBounds] = useState<LatLngBounds | null>(null);

  // todo: refactor this into it's own hook and context to be shared deeper
  const { data } = useListDayhomes({
    boundingBox: bounds
      ? {
        min: { latitude: bounds.getSouth(), longitude: bounds.getWest() },
        max: { latitude: bounds.getNorth(), longitude: bounds.getEast() },
      }
      : undefined,
  });

  const handleMoveEnd = async (
    { center, zoom, bounds }: {
      center: LatLng;
      zoom: number;
      bounds: LatLngBounds;
    },
  ) => {
    // setBounds(bounds);
    const atParam = `${center.latitude},${center.longitude},${zoom}`;
    await navigate({
      search: (prev) => ({ ...prev, l: atParam, postalCode: postalCode }),
    });
  };

  const mapState = zMapStateFromSearch.parse(l);
  const initialCenter = (mapState &&
    {
      latitude: mapState.latitude!,
      longitude: mapState.longitude!,
    } satisfies LatLng) ??
    geocode ??
    defaultCenter;

  return (
    <div className="">
      <div className="">
        <DayhomeMap
          center={initialCenter}
          items={data ?? []}
          onMoveEnd={handleMoveEnd}
          onSelect={(id: string) =>
            navigate({ search: (prev) => ({ ...prev, f: id }) })}
        />
      </div>

      <div className="fixed top-0 left-1/2 -translate-x-1/2 mt-4 max-w-lg w-full px-2">
        <div className="flex gap-4">
          <LinkButton to="/home" variant="outline">
            <HomeIcon />
          </LinkButton>
          <DayhomeSearch value={postalCode} />
        </div>
      </div>

      <div className="fixed bottom-0 w-full mx-2">
        {f && <DayhomeSheetPreview dayhomeId={f} />}
      </div>
    </div>
  );
}

function HomeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-house-icon lucide-house"
    >
      <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
      <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  );
}
