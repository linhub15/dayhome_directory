import { createServerFn } from "@tanstack/react-start";
import z from "@zod/zod";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db/db_middleware";
import { LatLngSchema } from "@/lib/geocoding/types";

const Request = z.object({
  name: z.string().optional(),
  boundingBox: z
    .object({
      min: LatLngSchema,
      max: LatLngSchema,
    })
    .optional(),
});

export const listDayhomesFn = createServerFn({ method: "GET" })
  .inputValidator(Request)
  .middleware([db])
  .handler(async ({ data, context }) => {
    const { db } = context;

    const result = await db.query.dayhome.findMany({
      limit: 100,
      where: (dayhome, { and, ilike }) => {
        const searchName = data.name
          ? ilike(dayhome.name, `%${data.name}%`)
          : undefined;

        const boundingBox = data.boundingBox
          ? sql`ST_Within(${dayhome.location}, ST_MakeEnvelope(
              ${data.boundingBox.min.longitude},
              ${data.boundingBox.min.latitude},
              ${data.boundingBox.max.longitude},
              ${data.boundingBox.max.latitude},
              4326))`
          : undefined;

        return and(searchName, boundingBox);
      },
    });

    return result;
  });
