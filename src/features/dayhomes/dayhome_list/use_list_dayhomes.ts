import { Kilometers, LatLng } from "@/lib/geocoding/types";
import { useQuery } from "@tanstack/react-query";
import { dayhomeKeys } from "../query_keys";
import { listDayhomesFn } from "./list_dayhomes.fn";
import { useServerFn } from "@tanstack/react-start";

export function useListDayhomes(
  { center, radius }: { center: LatLng; radius: Kilometers },
) {
  const listDayhomes = useServerFn(listDayhomesFn);

  return useQuery({
    queryKey: dayhomeKeys.list({ center, radius }),
    queryFn: async () => {
      return await listDayhomes({ data: { point: center, radius } });
    },
  });
}
