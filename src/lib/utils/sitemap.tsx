import { renderToStaticMarkup } from "react-dom/server";

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
      <UrlElement
        loc="https://discovercare.ca/home"
        lastmod={undefined}
        changefreq="weekly"
      />

      <UrlElement
        loc="https://discovercare.ca/map"
        changefreq="weekly"
        priority={1}
      />

      {props.urls.map((url) => (
        // biome-ignore lint/correctness/useJsxKeyInIterable: It's XML
        <UrlElement {...url} />
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
      <lastmod>{lastmod}</lastmod>
      {/* @ts-expect-error */}
      <changefreq>{changefreq}</changefreq>
      {/* @ts-expect-error */}
      <priority>{priority}</priority>
      {/* @ts-expect-error */}
    </url>
  );
}

export function generateSitemap(urls: SitemapUrl[]) {
  return `${xmlDeclaration}${renderToStaticMarkup(<SitemapXml urls={urls} />)}`;
}
