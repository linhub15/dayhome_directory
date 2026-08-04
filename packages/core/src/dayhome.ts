import { z } from "zod";

export const ageGroupValues = [
  "infant",
  "toddler",
  "preschool",
  "kindergarten",
  "grade_school",
] as const;

export const AgeGroupSchema = z.enum(ageGroupValues);
export type AgeGroup = z.infer<typeof AgeGroupSchema>;

export const IsoWeekdaySchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
  z.literal(7),
]);
export type IsoWeekday = z.infer<typeof IsoWeekdaySchema>;

export const weekdayIso: Record<IsoWeekday, string> = {
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
  7: "Sunday",
};

export const TimeOfDaySchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/);

export const OpenHoursSchema = z.object({
  weekday: IsoWeekdaySchema,
  openAt: TimeOfDaySchema,
  closeAt: TimeOfDaySchema,
});
export type OpenHours = z.infer<typeof OpenHoursSchema>;
