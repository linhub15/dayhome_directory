import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";

import { authMiddleware } from "./auth_middleware";

export const findAgencyWorkspace = createServerOnlyFn(
  async (userId: string) => {
    const [
      { getDb },
      { tenant, tenantMembership, tenantProfile },
      { and, eq },
    ] = await Promise.all([
      import("#/lib/db/database"),
      import("@dayhome/db/schema"),
      import("drizzle-orm"),
    ]);
    const [workspace] = await getDb()
      .select({
        id: tenant.id,
        slug: tenant.slug,
        type: tenant.type,
        name: tenantProfile.name,
        notificationEmail: tenantProfile.notificationEmail,
        role: tenantMembership.role,
      })
      .from(tenantMembership)
      .innerJoin(tenant, eq(tenant.id, tenantMembership.tenantId))
      .innerJoin(tenantProfile, eq(tenantProfile.tenantId, tenant.id))
      .where(
        and(eq(tenantMembership.userId, userId), eq(tenant.type, "agency")),
      )
      .limit(1);

    return workspace ?? null;
  },
);

export const getAgencySessionFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => ({
    user: context.user ?? null,
    workspace: context.user ? await findAgencyWorkspace(context.user.id) : null,
  }));
