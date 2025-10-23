import { db } from "@/lib/db/db_middleware";
import { buildConflictUpdateColumns } from "@/lib/db/drizzle_extensions";
import { dayhome, dayhomeOpenHours } from "@/lib/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { createUpdateSchema } from "drizzle-zod";
import z from "zod";

const requestSchema = createUpdateSchema(dayhome)
  .pick({
    id: true,
    name: true,
    address: true,
    location: true,
    phone: true,
    email: true,
    isLicensed: true,
    agencyName: true,
    ageGroups: true,
  })
  .required({ id: true })
  .extend({
    openHours: z.array(
      createUpdateSchema(dayhomeOpenHours)
        .pick({ dayhomeId: true, weekday: true, openAt: true, closeAt: true })
        .required({
          dayhomeId: true,
          weekday: true,
          openAt: true,
          closeAt: true,
        })
        .extend({
          weekday: z
            .literal(1)
            .or(z.literal(2))
            .or(z.literal(3))
            .or(z.literal(4))
            .or(z.literal(5))
            .or(z.literal(6))
            .or(z.literal(7)),
        }),
    ),
  });

export const updateDayhomeFn = createServerFn({ method: "POST" })
  .middleware([db])
  .inputValidator(requestSchema)
  .handler(async ({ data, context }) => {
    const { db } = context;

    await db.transaction(async (tx) => {
      await tx
        .update(dayhome)
        .set({
          name: data.name,
          address: data.address,
          location: data.location,
          phone: data.phone,
          email: data.email,
          isLicensed: data.isLicensed,
          agencyName: data.agencyName,
          ageGroups: data.ageGroups,
        })
        .where(eq(dayhome.id, data.id));

      await tx
        .insert(dayhomeOpenHours)
        .values(data.openHours)
        .onConflictDoUpdate({
          target: [dayhomeOpenHours.dayhomeId, dayhomeOpenHours.weekday],
          set: buildConflictUpdateColumns(dayhomeOpenHours, [
            "openAt",
            "closeAt",
          ]),
        });
    });
  });
