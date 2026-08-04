import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { db } from "@/lib/db/db_middleware";
import { geocodeCache } from "@dayhome/db/schema";
import { sql } from "drizzle-orm";
import { forwardGeocode } from "./mapbox";

export const geocodeFn = createServerFn({ method: "GET" })
  .validator(z.object({ query: z.string().trim().optional() }))
  .middleware([db])
  .handler(async ({ data, context: { db } }) => {
    const normalizedQuery = data.query?.trim().toLowerCase();

    if (!normalizedQuery) {
      return null;
    }

    const fromCache = await db.query.geocodeCache.findFirst({
      where: (cache) => sql`lower(${cache.query}) = ${normalizedQuery}`,
    });

    if (fromCache) {
      return {
        latitude: fromCache.geometry.y,
        longitude: fromCache.geometry.x,
      };
    }

    const result = await forwardGeocode(normalizedQuery);

    if (result) {
      await db.insert(geocodeCache).values({
        query: normalizedQuery,
        geometry: {
          x: result.longitude,
          y: result.latitude,
        },
      });
    }

    return result;
  });
