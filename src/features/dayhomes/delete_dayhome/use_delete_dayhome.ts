import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { deleteDayhomeFn } from "./delete_dayhome.fn";
import { toast } from "sonner";
import { dayhomeKeys } from "../query_keys";

export function useDeleteDayhome() {
  const queryClient = useQueryClient();
  const deleteDayhome = useServerFn(deleteDayhomeFn);

  return useMutation({
    mutationFn: async (dayhomeId: string) => {
      await deleteDayhome({ data: { dayhomeId: dayhomeId } });
      toast.info("Deleted");
      await queryClient.invalidateQueries({ queryKey: dayhomeKeys.lists() });
    },
  });
}
