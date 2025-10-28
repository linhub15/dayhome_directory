import z from "@zod/zod";

const clientEnvSchema = z.object({
  VITE_PUBLIC_POSTHOG_HOST: z.url().optional(),
  VITE_PUBLIC_POSTHOG_KEY: z.string().optional(),
});

export const clientEnv = clientEnvSchema.parse(import.meta.env);
