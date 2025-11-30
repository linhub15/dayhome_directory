import { Checkbox } from "@/components/ui/checkbox.tsx";
import { Toggle } from "@/components/ui/toggle.tsx";
import { createVacancyFn } from "@/features/show_vacancy/create_vacancy.fn.ts";
import { deleteVacancyFn } from "@/features/show_vacancy/delete_vacancy.fn.ts";
import { vacancyKeys } from "@/features/show_vacancy/query_keys.ts";
import { useListVacancies } from "@/features/show_vacancy/use_list_vacancies.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { LoaderCircleIcon } from "lucide-react";

function useCreateVacancy() {
  const createVacancy = useServerFn(createVacancyFn);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dayhomeId: string) => {
      await createVacancy({ data: { dayhomeId } });
      queryClient.invalidateQueries({ queryKey: vacancyKeys.list(dayhomeId) });
    },
    onError: (error) => {
      alert(error.message);
    },
  });
}

function useDeleteVacancy() {
  const queryClient = useQueryClient();
  const deleteVacancy = useServerFn(deleteVacancyFn);

  return useMutation({
    mutationFn: async (dayhomeId: string) => {
      await deleteVacancy({ data: { dayhomeId } });
      queryClient.invalidateQueries({ queryKey: vacancyKeys.list(dayhomeId) });
    },
    onError: (error) => {
      alert(error.message);
    },
  });
}

export function ToggleVacancyButton({ dayhomeId }: { dayhomeId: string }) {
  const { data } = useListVacancies(dayhomeId);
  const { mutateAsync: createVacancy, isPending: createPending } =
    useCreateVacancy();
  const { mutateAsync: deleteVacancy, isPending: deletePending } =
    useDeleteVacancy();

  if (!dayhomeId) {
    return;
  }

  const toggleVacancy = async (on: boolean) => {
    return on ? await createVacancy(dayhomeId) : await deleteVacancy(dayhomeId);
  };

  const isPending = createPending || deletePending;
  const hasVacancy = data?.length && data.length > 0 || false;

  return (
    <Toggle
      aria-label="Toggle bookmark"
      variant="outline"
      className="data-[state=on]:bg-transparent data-state=on:*:[svg]:fill-blue-500 data-[state=on]:*:[svg]:stroke-blue-500"
      pressed={hasVacancy}
      onPressedChange={toggleVacancy}
      disabled={isPending}
    >
      {isPending
        ? <LoaderCircleIcon className="animate-spin" />
        : <Checkbox checked={hasVacancy} />}
      Has openings
    </Toggle>
  );
}
