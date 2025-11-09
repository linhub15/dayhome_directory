import { z } from "@zod/zod";

const envSchema = z.object({
  DATABASE_URL: z.url(),
  MAPBOX_TOKEN: z.string().optional(),
});

export const serverEnv = envSchema.parse(process.env);
