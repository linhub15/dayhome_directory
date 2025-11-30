import { auth } from "@/lib/auth/auth_middleware.ts";
import { db } from "@/lib/db/db_middleware.ts";
import { listingClaim } from "@/lib/db/schema.ts";
import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import z from "@zod/zod";
import { and, eq } from "drizzle-orm";

const Request = z.object({
  dayhomeId: z.string(),
});

export const revokeClaimFn = createServerFn({ method: "POST" })
  .inputValidator(Request)
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

    if (!dayhomeExists) {
      throw new Error("Failed to delete, that dayhome doesn't exist");
    }

    await db
      .delete(listingClaim)
      .where(
        and(
          eq(listingClaim.userId, user.id),
          eq(listingClaim.dayhomeId, data.dayhomeId),
        ),
      );
  });
