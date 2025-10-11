export function hoursToTimeString(hours: number): string {
  // Handle floating error and round to nearest minute
  const totalMinutes = Math.round(hours * 60 + 1e-6);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}:${m.toString().padStart(2, "0")}`;
}
