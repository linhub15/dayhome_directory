import { listVacancyFn } from "@/features/show_vacancy/list_vacancy.fn.ts";
import { vacancyKeys } from "@/features/show_vacancy/query_keys.ts";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

export function useListVacancies(dayhomeId: string) {
  const listVacancies = useServerFn(listVacancyFn);

  return useQuery({
    queryKey: vacancyKeys.list(dayhomeId),
    queryFn: async () => {
      return await listVacancies({ data: { dayhomeId } });
    },
  });
}
