import { careTypeValues } from "@dayhome/db/schema";
import { z } from "zod";

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a valid date")
  .refine(
    (value) => {
      const parsed = new Date(`${value}T00:00:00Z`);
      return (
        !Number.isNaN(parsed.getTime()) &&
        parsed.toISOString().slice(0, 10) === value
      );
    },
    { message: "Choose a valid date" },
  );

export const inquirySubmissionSchema = z
  .object({
    parentFirstName: z.string().trim().min(1).max(100),
    parentLastName: z.string().trim().min(1).max(100),
    parentEmail: z.email().trim().toLowerCase(),
    careType: z.enum(careTypeValues),
    childBirthDate: isoDate,
    preferredStartDate: z.union([isoDate, z.literal("")]).optional(),
  })
  .refine((value) => value.childBirthDate <= toIsoDate(new Date()), {
    message: "Child's birthday cannot be in the future",
    path: ["childBirthDate"],
  });

export type InquirySubmission = z.infer<typeof inquirySubmissionSchema>;

export const careTypeLabels: Record<InquirySubmission["careType"], string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  drop_in: "Drop-in",
};

export function toIsoDate(date: Date) {
  const localDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60_000,
  );
  return localDate.toISOString().slice(0, 10);
}

export function formatChildAge(birthDate: string, asOf = new Date()) {
  const [year, month, day] = birthDate.split("-").map(Number);
  if (!year || !month || !day) return "Age unavailable";

  const birth = new Date(Date.UTC(year, month - 1, day));
  const current = new Date(
    Date.UTC(asOf.getFullYear(), asOf.getMonth(), asOf.getDate()),
  );

  let months =
    (current.getUTCFullYear() - birth.getUTCFullYear()) * 12 +
    current.getUTCMonth() -
    birth.getUTCMonth();

  if (current.getUTCDate() < birth.getUTCDate()) months -= 1;
  months = Math.max(0, months);

  if (months < 24) return `${months} ${months === 1 ? "month" : "months"}`;

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  return remainingMonths
    ? `${years}y ${remainingMonths}m`
    : `${years} ${years === 1 ? "year" : "years"}`;
}
