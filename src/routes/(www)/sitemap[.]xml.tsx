import { createFileRoute } from "@tanstack/react-router";
import { SEO_META } from "@/config/seo_meta.ts";
import { db } from "@/lib/db/db_middleware.ts";
import { generateSitemap, type SitemapUrl } from "@/lib/utils/sitemap.tsx";

export const Route = createFileRoute("/(www)/sitemap.xml")({
  server: {
    middleware: [db],
    handlers: {
      GET: async ({ context }) => {
        const { db } = context;

        const dayhomes = await db.query.dayhome.findMany({
          columns: {
            id: true,
            updatedAt: true,
          },
        });

        const urls: SitemapUrl[] = dayhomes.map((dayhome) => ({
          loc: `${SEO_META.url}/directory/${dayhome.id}`,
          lastmod: dayhome.updatedAt?.toISOString().split("T")[0],
        }));

        return new Response(generateSitemap(urls), {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "max-age=86400",
          },
        });
      },
    },
  },
});
