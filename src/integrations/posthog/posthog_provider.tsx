import { clientEnv } from "@/config/client_env";
import { PostHogProvider } from "posthog-js/react";

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <PostHogProvider
      apiKey={clientEnv.VITE_PUBLIC_POSTHOG_KEY}
      options={{
        api_host: clientEnv.VITE_PUBLIC_POSTHOG_HOST,
        defaults: "2025-05-24",
      }}
    >
      {children}
    </PostHogProvider>
  );
}
