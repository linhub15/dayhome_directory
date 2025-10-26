import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getDayhomeFn } from "@/features/dayhomes/get_dayhome.fn";
import { dayhomeKeys } from "@/features/dayhomes/query_keys";

export function useGetDayhome(id: string) {
  const getDayhome = useServerFn(getDayhomeFn);

  return useQuery({
    queryKey: dayhomeKeys.detail(id),
    queryFn: async () => {
      return await getDayhome({ data: { id } });
    },
  });
}
