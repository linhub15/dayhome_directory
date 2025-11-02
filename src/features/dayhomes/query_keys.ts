import type { Kilometers, LatLng } from "@/lib/geocoding/types";

export const dayhomeKeys = {
  all: ["dayhomes"] as const,

  lists: () => [...dayhomeKeys.all, "list"] as const,

  list: (filters: {
    name?: string;
    center?: LatLng;
    radius?: Kilometers;
    boundingBox?: { min: LatLng; max: LatLng };
  }) => [...dayhomeKeys.lists(), { filters }] as const,

  details: () => [...dayhomeKeys.all, "detail"] as const,

  detail: (id?: string) => [...dayhomeKeys.details(), id] as const,
};
