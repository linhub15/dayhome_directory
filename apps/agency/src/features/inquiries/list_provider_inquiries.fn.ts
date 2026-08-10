import { findAgencyWorkspace } from "#/lib/auth/agency_session.fn";
import { authMiddleware } from "#/lib/auth/auth_middleware";
import { createServerFn } from "@tanstack/react-start";

export const listProviderInquiriesFn = createServerFn({
  method: "GET",
})
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    if (!context.user) throw new Error("You must be signed in");
    const tenant = await findAgencyWorkspace(context.user.id);
    if (!tenant) throw new Error("Complete agency onboarding first");

    const { getDb } = await import("#/lib/db/database");
    const inquiries = await getDb().query.inquiry.findMany({
      where: (table, { eq }) => eq(table.tenantId, tenant.id),
      with: {
        children: {
          orderBy: (table, { asc }) => asc(table.createdAt),
        },
        statusHistory: {
          with: { changedBy: true },
          orderBy: (table, { asc }) => asc(table.changedAt),
        },
      },
      orderBy: (table, { desc }) => desc(table.createdAt),
      limit: 100,
    });

    return { tenant, inquiries };
  });
