import { auth } from "@/lib/auth/auth_middleware.ts";
import { db } from "@/lib/db/db_middleware.ts";
import { dayhome, listingClaim } from "@/lib/db/schema.ts";
import { notFound, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import z from "@zod/zod";
import { eq } from "drizzle-orm";

const request = z.object({
  dayhomeId: z.string(),
  email: z.email().optional(),
});

export type ClaimListingRequest = z.infer<typeof request>;

export const claimListingFn = createServerFn({ method: "POST" })
  .inputValidator(request)
  .middleware([auth, db])
  .handler(async ({ context, data }) => {
    const { user, db } = context;

    if (!user) {
      throw redirect({ to: "/login" });
    }

    const dayhomeExists = await db.query.dayhome.findFirst({
      where: (item, { eq }) => eq(item.id, data.dayhomeId),
      columns: { id: true },
    });

    if (!dayhomeExists?.id) {
      throw notFound();
    }

    const userAlreadyHasClaim = await db.query.listingClaim.findFirst({
      where: (item, { eq }) => eq(item.userId, user.id),
      columns: { dayhomeId: true },
    });

    if (userAlreadyHasClaim?.dayhomeId) {
      // 403 forbidden
      throw new Error("You have already claimed a listing.");
    }

    await db.transaction(async (transaction) => {
      await transaction.insert(listingClaim).values({
        dayhomeId: data.dayhomeId,
        userId: user.id,
      });

      if (data.email) {
        await transaction
          .update(dayhome)
          .set({ email: data.email })
          .where(eq(dayhome.id, data.dayhomeId));
      }
    });
  });
