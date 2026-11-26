import { hasActiveVacancy } from "./vacancies.ts";

export function VacancyNotice(props: { dayhomeId: string }) {
  if (!hasActiveVacancy(props.dayhomeId)) return;

  return (
    <div className="flex items-center gap-x-1.5">
      <div className="flex-none rounded-full bg-emerald-500/20 p-1">
        <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
      </div>
      <p className="text-xs/5 text-gray-500">Has Openings</p>
    </div>
  );
}
