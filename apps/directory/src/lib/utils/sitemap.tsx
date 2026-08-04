import { renderToStaticMarkup } from "react-dom/server";
import { SEO_META } from "@/config/seo_meta.ts";

export type SitemapUrl = {
  loc: string;
  /** YYYY-MM-DD */
  lastmod?: string;
  changefreq?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  /**A number from 0 to 1 inclusive */
  priority?: number;
};
const xmlDeclaration = `<?xml version="1.0" encoding="UTF-8"?>`;

function SitemapXml(props: { urls: SitemapUrl[] }) {
  return (
    /* @ts-expect-error */
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <UrlElement loc={`${SEO_META.url}/home`} changefreq="weekly" />

      <UrlElement
        loc={`${SEO_META.url}/map`}
        changefreq="weekly"
        priority={1}
      />

      <UrlElement loc={`${SEO_META.url}/info`} changefreq="monthly" />

      {props.urls.map((url) => (
        <UrlElement key={url.loc} {...url} />
      ))}

      {/* @ts-expect-error */}
    </urlset>
  );
}

function UrlElement({ loc, lastmod, changefreq, priority }: SitemapUrl) {
  return (
    // @ts-expect-error
    <url>
      {/* @ts-expect-error */}
      <loc>{loc}</loc>
      {/* @ts-expect-error */}
      {lastmod && <lastmod>{lastmod}</lastmod>}
      {/* @ts-expect-error */}
      {changefreq && <changefreq>{changefreq}</changefreq>}
      {/* @ts-expect-error */}
      {priority && <priority>{priority}</priority>}
      {/* @ts-expect-error */}
    </url>
  );
}

export function generateSitemap(urls: SitemapUrl[]) {
  return `${xmlDeclaration}${renderToStaticMarkup(<SitemapXml urls={urls} />)}`;
}
