import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";
import leafletCss from "leaflet/dist/leaflet.css?url";
import type { QueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { SEO_META } from "@/config/seo_meta";

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: SEO_META.title },
      { name: "description", content: SEO_META.description },
      { property: "og:title", content: SEO_META.title },
      { property: "og:description", content: SEO_META.description },
      { property: "og:type", content: SEO_META.type },
      { property: "og:url", content: SEO_META.url },
      { property: "og:image", content: SEO_META.image.url },
      { property: "og:image:type", content: SEO_META.image.type },
      { property: "og:image:width", content: SEO_META.image.width },
      { property: "og:image:height", content: SEO_META.image.height },
      { property: "og:image:alt", content: SEO_META.image.alt },
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
