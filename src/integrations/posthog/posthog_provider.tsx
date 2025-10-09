import { clientEnv } from "@/config/client_env";
import { PostHogProvider } from "posthog-js/react";

const options = {
  api_host: clientEnv.VITE_PUBLIC_POSTHOG_HOST,
  defaults: "2025-05-24",
} as const;

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <PostHogProvider
      apiKey={clientEnv.VITE_PUBLIC_POSTHOG_KEY}
      options={options}
    >
      {children}
    </PostHogProvider>
  );
}
