import { db } from "@/lib/db/db_middleware";
import { forwardGeocode } from "@/lib/geocoding/mapbox";
import { LatLngSchema } from "@/lib/geocoding/types";
import { createServerFn } from "@tanstack/react-start";
import { sql } from "drizzle-orm";
import z from "zod";

const Request = z.object({
  name: z.string().optional(),
  postalCode: z.string().optional(),
  point: LatLngSchema.optional(),
  /** Kilometers to Meters */
  radius: z.number().optional().transform((v) => v && v * 1000).default(1000),
});

export const listDayhomesFn = createServerFn({ method: "GET" })
  .inputValidator(Request)
  .middleware([db])
  .handler(async ({ data, context }) => {
    const { db } = context;

    const currentLatLng = data.point ?? await getCurrentLatLng({
      postalCode: data.postalCode,
    });

    const result = await db.query.dayhome.findMany({
      limit: 20,
      where: (dayhome, { and, ilike }) => {
        const searchName = data.name
          ? ilike(dayhome.name, `%${data.name}%`)
          : undefined;

        const distance = currentLatLng
          ? sql`ST_DWithin(location::geography, ST_MakePoint(${currentLatLng.longitude}, ${currentLatLng.latitude})::geography, ${data.radius})`
          : undefined;

        return and(
          searchName,
          distance,
        );
      },
    });

    return result;
  });

async function getCurrentLatLng({ postalCode }: { postalCode?: string }) {
  if (!postalCode) {
    return null;
  }

  return await forwardGeocode(postalCode);
}
