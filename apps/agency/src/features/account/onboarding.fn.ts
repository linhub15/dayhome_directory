import { findAgencyWorkspace } from "#/lib/auth/agency_session.fn";
import { authMiddleware } from "#/lib/auth/auth_middleware";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const onboardingSchema = z.object({
  businessName: z.string().trim().min(2).max(120),
});

export const createAgencyWorkspaceFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => onboardingSchema.parse(input))
  .handler(async ({ data, context }) => {
    if (!context.user) throw new Error("You must be signed in to onboard");
    const user = context.user;

    const existing = await findAgencyWorkspace(user.id);
    if (existing) return existing;

    const baseSlug = slugify(data.businessName) || "agency";
    const slug = `${baseSlug}-${crypto.randomUUID().slice(0, 8)}`;
    const [{ getDb }, { tenant, tenantMembership, tenantProfile }] =
      await Promise.all([
        import("#/lib/db/database"),
        import("@dayhome/db/schema"),
      ]);
    const db = getDb();

    await db.transaction(async (tx) => {
      const [createdTenant] = await tx
        .insert(tenant)
        .values({ slug, type: "agency" })
        .returning({ id: tenant.id });
      if (!createdTenant) throw new Error("Could not create agency workspace");

      await tx.insert(tenantProfile).values({
        tenantId: createdTenant.id,
        name: data.businessName,
        notificationEmail: user.email,
      });
      await tx.insert(tenantMembership).values({
        tenantId: createdTenant.id,
        userId: user.id,
        role: "owner",
      });
    });

    const workspace = await findAgencyWorkspace(user.id);
    if (!workspace) throw new Error("Agency workspace was not created");
    return workspace;
  });

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}
