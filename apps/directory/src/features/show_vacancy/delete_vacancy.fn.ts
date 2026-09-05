import { auth } from "@/lib/auth/auth_middleware.ts";
import { db } from "@/lib/db/db_middleware.ts";
import { invalidateDayhomeMapCache } from "@/features/dayhomes/dayhome_map/dayhome_map_cache.ts";
import { dayhomeVacancy } from "@dayhome/db/schema";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { eq } from "drizzle-orm";

export const deleteVacancyFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      dayhomeId: z.string(),
    }),
  )
  .middleware([auth, db])
  .handler(async ({ context, data }) => {
    const { user, db } = context;

    if (!user) {
      throw new Error("401 Unauthorized");
    }

    const isListingClaimed = await db.query.listingClaim.findFirst({
      columns: { dayhomeId: true },
      where: (claim, { and, eq }) =>
        and(eq(claim.dayhomeId, data.dayhomeId), eq(claim.userId, user.id)),
    });

    if (!isListingClaimed) {
      throw new Error("403 Unauthorized");
    }

    await db
      .delete(dayhomeVacancy)
      .where(eq(dayhomeVacancy.dayhomeId, data.dayhomeId));

    await invalidateDayhomeMapCache();
  });
