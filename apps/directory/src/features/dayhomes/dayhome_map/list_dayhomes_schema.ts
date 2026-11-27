import { AgeGroupSchema } from "@dayhome/core/dayhome";
import { z } from "zod";

const ListDayhomeSchema = z.object({
  id: z.string(),
  name: z.string(),
  isLicensed: z.boolean(),
  ageGroups: z.array(AgeGroupSchema).nullable(),
  location: z.object({
    x: z.number(),
    y: z.number(),
  }),
});

export const ListDayhomesSchema = z.array(ListDayhomeSchema);
