import { createServerFn } from "@tanstack/react-start";
import { and, eq, inArray } from "drizzle-orm";
import z from "zod";
import { admin } from "@/lib/auth/admin_middleware";
import { db } from "@/lib/db/db_middleware";
import { buildConflictUpdateColumns } from "@/lib/db/drizzle_extensions";
import { dayhomeOpenHours } from "@/lib/db/schema";
import { pattern } from "@/lib/utils/nanoid";

const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/);

const openHoursRowSchema = z
  .object({
    weekday: z.union([
      z.literal(1),
      z.literal(2),
      z.literal(3),
      z.literal(4),
      z.literal(5),
      z.literal(6),
      z.literal(7),
    ]),
    openAt: timeSchema,
    closeAt: timeSchema,
  })
  .superRefine((value, context) => {
    if (value.openAt >= value.closeAt) {
      context.addIssue({
        code: "custom",
        path: ["closeAt"],
        message: "closeAt must be after openAt",
      });
    }
  });

const requestSchema = z
  .object({
    dayhomeId: z.nanoid({ pattern }),
    openHours: z.array(openHoursRowSchema),
  })
  .superRefine((value, context) => {
    const weekdays = value.openHours.map((row) => row.weekday);
    const uniqueWeekdays = new Set(weekdays);

    if (uniqueWeekdays.size !== weekdays.length) {
      context.addIssue({
        code: "custom",
        path: ["openHours"],
        message: "Each weekday can only be set once",
      });
    }
  });

export const updateDayhomeOpenHoursFn = createServerFn({ method: "POST" })
  .middleware([admin, db])
  .inputValidator(requestSchema)
  .handler(async ({ data, context }) => {
    const { db } = context;

    await db.transaction(async (tx) => {
      const exists = await tx.query.dayhome.findFirst({
        where: (item, { eq }) => eq(item.id, data.dayhomeId),
        columns: { id: true },
      });

      if (!exists?.id) {
        throw new Error("Dayhome not found");
      }

      const existingRows = await tx.query.dayhomeOpenHours.findMany({
        where: (item, { eq }) => eq(item.dayhomeId, data.dayhomeId),
        columns: { weekday: true },
      });

      const incomingWeekdays = new Set(
        data.openHours.map((item) => item.weekday),
      );

      const weekdaysToDelete = existingRows
        .map((item) => item.weekday)
        .filter((weekday) => !incomingWeekdays.has(weekday));

      if (weekdaysToDelete.length) {
        await tx
          .delete(dayhomeOpenHours)
          .where(
            and(
              eq(dayhomeOpenHours.dayhomeId, data.dayhomeId),
              inArray(dayhomeOpenHours.weekday, weekdaysToDelete),
            ),
          );
      }

      if (data.openHours.length) {
        await tx
          .insert(dayhomeOpenHours)
          .values(
            data.openHours.map((item) => ({
              dayhomeId: data.dayhomeId,
              weekday: item.weekday,
              openAt: item.openAt,
              closeAt: item.closeAt,
            })),
          )
          .onConflictDoUpdate({
            target: [dayhomeOpenHours.dayhomeId, dayhomeOpenHours.weekday],
            set: buildConflictUpdateColumns(dayhomeOpenHours, [
              "openAt",
              "closeAt",
            ]),
          });
      }
    });

    return { dayhomeId: data.dayhomeId };
  });
