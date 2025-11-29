import { Button } from "@/components/ui/button.tsx";
import { createVacancyFn } from "@/features/show_vacancy/create_vacancy.fn.ts";
import { vacancyKeys } from "@/features/show_vacancy/query_keys.ts";
import { useListVacancies } from "@/features/show_vacancy/use_list_vacancies.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

function useCreateVacancy() {
  const createVacancy = useServerFn(createVacancyFn);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dayhomeId: string) => {
      await createVacancy({ data: { dayhomeId } });
      queryClient.invalidateQueries({ queryKey: vacancyKeys.list(dayhomeId) });
      alert("Success");
    },
    onError: (error) => {
      alert(error.message);
    },
  });
}

export function CreateVacancyButton({ dayhomeId }: { dayhomeId: string }) {
  const { data } = useListVacancies(dayhomeId);
  const { mutateAsync } = useCreateVacancy();

  if (!dayhomeId) {
    return;
  }

  const alreadyHasVacancy = !!data?.find(
    (vacancy) => vacancy.dayhomeId === dayhomeId,
  );

  if (alreadyHasVacancy) {
    return;
  }

  const createVacancy = async () => {
    await mutateAsync(dayhomeId);
  };

  // todo: hubert turn this into a toggle
  return (
    <Button type="button" onClick={createVacancy}>
      Post Vacancy
    </Button>
  );
}
