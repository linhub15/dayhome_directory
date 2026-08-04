import { createServerFn } from "@tanstack/react-start";
import { db } from "@/lib/db/db_middleware";
import { sql } from "drizzle-orm";
import z from "zod";
import { forwardAutocomplete } from "./mapbox";

export const autocompleteGeocodeFn = createServerFn({ method: "GET" })
  .validator(z.object({ query: z.string().trim().optional() }))
  .middleware([db])
  .handler(async ({ data, context: { db } }) => {
    const normalizedQuery = data.query?.trim();

    if (!normalizedQuery || normalizedQuery.length < 3) {
      return [];
    }

    const cachedExactMatch = await db.query.geocodeCache.findFirst({
      where: (cache) =>
        sql`lower(${cache.query}) = ${normalizedQuery.toLowerCase()}`,
    });

    const mapboxSuggestions = await forwardAutocomplete(normalizedQuery);

    if (!cachedExactMatch) {
      return mapboxSuggestions;
    }

    const cachedSuggestion = {
      address: normalizedQuery,
      latitude: cachedExactMatch.geometry.y,
      longitude: cachedExactMatch.geometry.x,
    };

    const hasSameCoordinates = mapboxSuggestions.some(
      (item) =>
        item.latitude === cachedSuggestion.latitude &&
        item.longitude === cachedSuggestion.longitude,
    );

    return hasSameCoordinates
      ? mapboxSuggestions
      : [cachedSuggestion, ...mapboxSuggestions];
  });
