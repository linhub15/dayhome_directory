import { LatLng } from "@/lib/geocoding/types";
import { useQuery } from "@tanstack/react-query";
import { dayhomeKeys } from "../query_keys.ts";
import { listDayhomesFn } from "./list_dayhomes.fn.ts";
import { useServerFn } from "@tanstack/react-start";

export type ListDayhomesData = Awaited<ReturnType<typeof listDayhomesFn>>;

export function useListDayhomes(
  { boundingBox }: {
    boundingBox?: { min: LatLng; max: LatLng };
  },
) {
  const listDayhomes = useServerFn(listDayhomesFn);

  return useQuery({
    enabled: !!boundingBox,
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
}
