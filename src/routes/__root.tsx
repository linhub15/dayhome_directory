import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";
import leafletCss from "leaflet/dist/leaflet.css?url";
import type { QueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import * as PostHog from "@/integrations/posthog/posthog_provider";

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "TanStack Start Starter",
      },
    ],
    links: [
      { rel: "stylesheet", href: "https://rsms.me/inter/inter.css" },
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: leafletCss },
    ],
  }),
  shellComponent: ({ children }) => (
    <RootDocument>
      <PostHog.Provider>{children}</PostHog.Provider>
    </RootDocument>
  ),
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="m-2 sm:m-0">
        {children}

        <Toaster />

        <Scripts />
      </body>
    </html>
  );
}
