import type { AgeGroupKey } from "@/features/dayhomes/dayhome_map/filter_modal.tsx";
import { dayhomeKeys } from "@/features/dayhomes/query_keys.ts";
import { useQuery } from "@tanstack/react-query";
import { hasActiveVacancy } from "@/features/show_vacancy/vacancies.ts";
import { ListDayhomesSchema } from "./list_dayhomes_schema.ts";

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
  return useQuery({
    queryKey: dayhomeKeys.list({}),
    queryFn: async () => {
      const response = await fetch("/map.json");
      if (!response.ok) throw new Error("Unable to load the map listings");
      return ListDayhomesSchema.parse(await response.json());
    },
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    select: (markers) => {
      const now = new Date();
      return markers
        .map((item) => ({
          ...item,
          hasVacancy: hasActiveVacancy(item.id, now),
        }))
        .filter((item) => !filters?.hasVacancy || item.hasVacancy)
        .filter((item) => !filters?.onlyLicensed || item.isLicensed)
        .filter((item) => {
          if (!filters?.ageGroups) return true;
          return item.ageGroups?.some((ageGroup) =>
            filters.ageGroups?.includes(ageGroup),
          );
        });
    },
  });
}
