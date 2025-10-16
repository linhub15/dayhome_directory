import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";
import leafletCss from "leaflet/dist/leaflet.css?url";
import type { QueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { seo } from "@/config/seo";

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: seo.title },
      { name: "description", content: seo.description },
      { property: "og:title", content: seo.title },
      { property: "og:description", content: seo.description },
      { property: "og:type", content: seo.type },
      { property: "og:url", content: seo.url },
      { property: "og:image", content: seo.image.url },
      { property: "og:image:type", content: seo.image.type },
      { property: "og:image:width", content: seo.image.width },
      { property: "og:image:height", content: seo.image.height },
      { property: "og:image:alt", content: seo.image.alt },
    ],
    links: [
      { rel: "stylesheet", href: "https://rsms.me/inter/inter.css" },
      { rel: "stylesheet", href: leafletCss },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}

        <Toaster />

        <Scripts />
      </body>
    </html>
  );
}
