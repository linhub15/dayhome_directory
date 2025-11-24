import { useListVacancies } from "@/features/show_vacancy/use_list_vacancies.ts";

export function VacancyNotice(props: { dayhomeId: string }) {
  const { data } = useListVacancies(props.dayhomeId);

  if (!data) {
    return;
  }

  if (!data || !data.length) {
    return;
  }

  return (
    <div className="flex items-center gap-x-1.5">
      <div className="flex-none rounded-full bg-emerald-500/20 p-1">
        <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
      </div>
      <p className="text-xs/5 text-gray-500">Has Openings</p>
    </div>
  );
}
