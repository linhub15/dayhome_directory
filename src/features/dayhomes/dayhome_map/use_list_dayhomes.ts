import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import type { AgeGroupKey } from "@/features/dayhomes/dayhome_map/filter_modal.tsx";
import { dayhomeKeys } from "@/features/dayhomes/query_keys.ts";
import type { LatLng } from "@/lib/geocoding/types";
import { listDayhomesFn } from "./list_dayhomes.fn.ts";

export type ListDayhomesData = Awaited<ReturnType<typeof listDayhomesFn>>;

export function useListDayhomes({
  boundingBox,
  filters,
}: {
  boundingBox?: { min: LatLng; max: LatLng };
  /** Client-side filters */
  filters?: {
    onlyLicensed?: boolean;
    ageGroups?: Record<AgeGroupKey, boolean>;
  };
}) {
  const listDayhomes = useServerFn(listDayhomesFn);

  const result = useQuery({
    // enabled: !!boundingBox,
    queryKey: dayhomeKeys.list({ boundingBox }),
    queryFn: async () => {
      return await listDayhomes({
        data: {
          boundingBox: {
            min: { latitude: 53.335624, longitude: -113.715512 },
            max: { latitude: 53.71737, longitude: -113.270719 },
          },
        },
      });
    },
  });

  result.data = result.data
    ?.filter((item) => {
      if (!filters) return true;
      return filters.onlyLicensed ? item.isLicensed : true;
    })
    .filter((item) => {
      if (!filters || !filters.ageGroups) return true;

      const filteredAgeGroups = Object.entries(filters.ageGroups)
        .filter(([, v]) => v)
        .map(([k]) => k as AgeGroupKey);

      if (!filteredAgeGroups.length) return true;

      return item.ageGroups?.some((ag) => filteredAgeGroups.includes(ag));
    });

  return result;
}
