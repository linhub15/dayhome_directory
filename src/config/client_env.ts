import z from "zod";

const clientEnvSchema = z.object({
  VITE_PUBLIC_POSTHOG_HOST: z.url(),
  VITE_PUBLIC_POSTHOG_KEY: z.string(),
});

export const clientEnv = clientEnvSchema.parse(import.meta.env);
