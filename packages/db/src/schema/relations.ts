import { relations } from "drizzle-orm";

import { user } from "./auth.ts";
import { dayhome } from "./directory.ts";
import { inquiry } from "./inquiries.ts";
import { tenant, tenantMembership, tenantProfile } from "./tenancy.ts";

export const tenantRelations = relations(tenant, ({ one, many }) => ({
  profile: one(tenantProfile),
  memberships: many(tenantMembership),
  locations: many(dayhome),
  inquiries: many(inquiry),
}));

export const tenantProfileRelations = relations(tenantProfile, ({ one }) => ({
  tenant: one(tenant, {
    fields: [tenantProfile.tenantId],
    references: [tenant.id],
  }),
}));

export const tenantMembershipRelations = relations(
  tenantMembership,
  ({ one }) => ({
    tenant: one(tenant, {
      fields: [tenantMembership.tenantId],
      references: [tenant.id],
    }),
    user: one(user, {
      fields: [tenantMembership.userId],
      references: [user.id],
    }),
  }),
);
