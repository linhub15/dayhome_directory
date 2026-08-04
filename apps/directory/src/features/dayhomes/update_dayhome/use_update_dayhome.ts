import { dayhomeKeys } from "@/features/dayhomes/query_keys";
import { updateDayhomeFn } from "@/features/dayhomes/update_dayhome/update_dayhome.fn";
import { updateDayhomeOpenHoursFn } from "@/features/dayhomes/update_dayhome/update_dayhome_open_hours.fn";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

export function useUpdateDayhomeBasic() {
  const queryClient = useQueryClient();
  const updateDayhome = useServerFn(updateDayhomeFn);

  return useMutation({
    mutationFn: async (
      request: Parameters<typeof updateDayhomeFn>[0]["data"],
    ) => {
      const response = await updateDayhome({ data: request });

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: dayhomeKeys.detail(request.id),
        }),
        queryClient.invalidateQueries({ queryKey: dayhomeKeys.lists() }),
      ]);

      return response;
    },
  });
}

export function useUpdateDayhomeOpenHours() {
  const queryClient = useQueryClient();
  const updateDayhomeOpenHours = useServerFn(updateDayhomeOpenHoursFn);

  return useMutation({
    mutationFn: async (
      request: Parameters<typeof updateDayhomeOpenHoursFn>[0]["data"],
    ) => {
      const response = await updateDayhomeOpenHours({ data: request });

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: dayhomeKeys.detail(request.dayhomeId),
        }),
        queryClient.invalidateQueries({ queryKey: dayhomeKeys.lists() }),
      ]);

      return response;
    },
  });
}
