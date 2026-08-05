import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";
import { ThemeScript } from "@dayhome/ui/theme-script";
import type { ReactNode } from "react";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Dayhome Flow | Agency inquiry pipeline" },
      {
        name: "description",
        content: "A calm, organized inquiry pipeline for dayhome agencies.",
      },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
