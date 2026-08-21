import type { AgeGroupKey } from "@/features/dayhomes/dayhome_map/filter_modal.tsx";
import { listDayhomesFn } from "@/features/dayhomes/dayhome_map/list_dayhomes.fn.ts";
import { dayhomeKeys } from "@/features/dayhomes/query_keys.ts";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

export function useListDayhomes({
  filters,
}: {
  /** Client-side filters */
  filters?: {
    hasVacancy?: boolean;
    onlyLicensed?: boolean;
    ageGroups?: Array<AgeGroupKey>;
  };
}) {
  const listDayhomes = useServerFn(listDayhomesFn);

  const result = useQuery({
    queryKey: dayhomeKeys.list({}),
    queryFn: () => listDayhomes(),
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  result.data = result.data
    ?.filter((item) => {
      if (!filters) return true;
      return filters.hasVacancy ? item.hasVacancy : true;
    })
    .filter((item) => {
      if (!filters) return true;
      return filters.onlyLicensed ? item.isLicensed : true;
    })
    .filter((item) => {
      if (!filters || !filters.ageGroups) return true;

      return item.ageGroups?.some((ag) => filters.ageGroups?.includes(ag));
    });

  return result;
}
