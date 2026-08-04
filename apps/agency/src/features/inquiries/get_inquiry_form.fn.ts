import { getDb } from "#/lib/db/database";
import { createServerFn } from "@tanstack/react-start";
import { tenant, tenantProfile } from "@dayhome/db/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const getInquiryFormFn = createServerFn({ method: "GET" })
  .validator(z.object({ tenantSlug: z.string().trim().min(1).max(100) }))
  .handler(async ({ data }) => {
    const db = getDb();
    const [result] = await db
      .select({ name: tenantProfile.name, slug: tenant.slug })
      .from(tenant)
      .innerJoin(tenantProfile, eq(tenantProfile.tenantId, tenant.id))
      .where(
        and(
          eq(tenant.slug, data.tenantSlug),
          eq(tenantProfile.isInquiryFormEnabled, true),
        ),
      )
      .limit(1);

    return result ?? null;
  });
