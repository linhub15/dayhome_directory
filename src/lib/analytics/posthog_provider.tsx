import { PostHogProvider } from "posthog-js/react";
import { clientEnv } from "@/config/client_env";

export function Provider({ children }: { children: React.ReactNode }) {
  const apiKey = clientEnv.VITE_PUBLIC_POSTHOG_KEY;
  const apiHost = clientEnv.VITE_PUBLIC_POSTHOG_HOST;

  if (!apiKey || !apiHost) {
    return children;
  }

  return (
    <PostHogProvider
      apiKey={apiKey}
      options={{
        api_host: apiHost,
        defaults: "2025-05-24",
      }}
    >
      {children}
    </PostHogProvider>
  );
}
