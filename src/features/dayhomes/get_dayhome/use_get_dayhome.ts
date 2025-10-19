import { useQuery } from "@tanstack/react-query";
import { dayhomeKeys } from "../query_keys";
import { getDayhomeFn } from "../get_dayhome.fn";
import { useServerFn } from "@tanstack/react-start";

export function useGetDayhome(id: string) {
  const getDayhome = useServerFn(getDayhomeFn);

  return useQuery({
    queryKey: dayhomeKeys.detail(id),
    queryFn: async () => {
      return await getDayhome({ data: { id } });
    },
  });
}
