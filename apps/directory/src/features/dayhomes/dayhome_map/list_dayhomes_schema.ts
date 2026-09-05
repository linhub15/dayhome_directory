import { AgeGroupSchema } from "@dayhome/core/dayhome";
import { z } from "zod";

export const ListDayhomeSchema = z.object({
  id: z.string(),
  name: z.string(),
  isLicensed: z.boolean(),
  ageGroups: z.array(AgeGroupSchema).nullable(),
  location: z.object({
    x: z.number(),
    y: z.number(),
  }),
  hasVacancy: z.boolean(),
});

export const ListDayhomesSchema = z.array(ListDayhomeSchema);

export type ListDayhomesData = z.infer<typeof ListDayhomesSchema>;
