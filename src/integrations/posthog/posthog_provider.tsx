import posthog from "posthog-js";
import { clientEnv } from "@/config/client_env";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";

export function Provider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(clientEnv.VITE_PUBLIC_POSTHOG_KEY, {
      api_host: clientEnv.VITE_PUBLIC_POSTHOG_HOST,
      defaults: "2025-05-24",
    });
  }, []);

  return (
    <PostHogProvider client={posthog}>
      {children}
    </PostHogProvider>
  );
}
