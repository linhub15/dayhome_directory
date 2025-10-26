import { createServerFn } from "@tanstack/react-start";
import z from "@zod/zod";
import { db } from "@/lib/db/db_middleware";
import { geocodeCache } from "@/lib/db/schema";
import { forwardGeocode } from "./mapbox";

export const geocodeFn = createServerFn({ method: "GET" })
  .inputValidator(z.object({ query: z.string().trim().optional() }))
  .middleware([db])
  .handler(async ({ data, context: { db } }) => {
    if (!data.query) {
      return null;
    }

    const fromCache = await db.query.geocodeCache.findFirst({
      where: (cache, { eq }) => eq(cache.query, data.query!),
    });

    if (fromCache) {
      return {
        latitude: fromCache.geometry.y,
        longitude: fromCache.geometry.x,
      };
    }

    const result = await forwardGeocode(data.query);

    if (result) {
      await db.insert(geocodeCache).values({
        query: data.query,
        geometry: {
          x: result.longitude,
          y: result.latitude,
        },
      });
    }

    return result;
  });
