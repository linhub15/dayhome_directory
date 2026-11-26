// Add a listing ID and its last available date (YYYY-MM-DD in UTC).
const vacancyEndDates = new Map<string, string>([]);

export function hasActiveVacancy(dayhomeId: string, now = new Date()) {
  const endDate = vacancyEndDates.get(dayhomeId);
  return endDate !== undefined && endDate >= now.toISOString().slice(0, 10);
}
