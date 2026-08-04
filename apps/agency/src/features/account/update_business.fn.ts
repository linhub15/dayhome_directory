import { findAgencyWorkspace } from "#/lib/auth/agency_session.fn";
import { authMiddleware } from "#/lib/auth/auth_middleware";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const settingsSchema = z.object({
  businessName: z.string().trim().min(2).max(120),
});

export const updateBusinessFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => settingsSchema.parse(input))
  .handler(async ({ data, context }) => {
    if (!context.user) throw new Error("You must be signed in");
    const workspace = await findAgencyWorkspace(context.user.id);
    if (!workspace || workspace.role !== "owner") {
      throw new Error("Only the agency owner can update this business");
    }

    const [{ getDb }, { tenantProfile }, { eq }] = await Promise.all([
      import("#/lib/db/database"),
      import("@dayhome/db/schema"),
      import("drizzle-orm"),
    ]);
    await getDb()
      .update(tenantProfile)
      .set({ name: data.businessName })
      .where(eq(tenantProfile.tenantId, workspace.id));
    return { name: data.businessName };
  });
