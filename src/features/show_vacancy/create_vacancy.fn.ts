import { auth } from "@/lib/auth/auth_middleware.ts";
import { db } from "@/lib/db/db_middleware.ts";
import { dayhomeVacancy } from "@/lib/db/schema.ts";
import { createServerFn } from "@tanstack/react-start";
import z from "@zod/zod";

export const createVacancyFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ dayhomeId: z.string() }))
  .middleware([auth, db])
  .handler(async ({ context, data }) => {
    const { user, db } = context;

    if (!user) {
      throw new Error("401 Unauthorized");
    }

    const today = new Date();
    const defaultDurationDays = 7;
    const endOn = new Date(today);
    endOn.setDate(today.getDate() + defaultDurationDays);

    await db.insert(dayhomeVacancy).values({
      dayhomeId: data.dayhomeId,
      startOn: today,
      endOn: endOn,
    });
  });
