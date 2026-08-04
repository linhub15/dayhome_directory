import { useDebouncedValue } from "@tanstack/react-pacer";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { geocodeFn } from "./geocode.fn";

export function useGeocode(query: string) {
  const geocode = useServerFn(geocodeFn);

  const [debouncedValue] = useDebouncedValue(query.trim(), { wait: 1500 });

  return useQuery({
    queryKey: ["geocode", debouncedValue],
    queryFn: async () => {
      const response = await geocode({ data: { query: debouncedValue } });

      if (!response) return;

      return response;
    },
    enabled: !!debouncedValue,
  });
}
