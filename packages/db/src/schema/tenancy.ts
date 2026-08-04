import {
  boolean,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { user } from "./auth.ts";
import { defaultColumns } from "./columns.ts";

export const tenantRoleValues = ["owner", "admin", "member"] as const;
export const tenantRole = pgEnum("tenant_role", tenantRoleValues);

export const tenantTypeValues = ["agency"] as const;
export const tenantType = pgEnum("tenant_type", tenantTypeValues);

/** Stable tenancy and authorization boundary shared by every app. */
export const tenant = pgTable(
  "tenant",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull(),
    type: tenantType("type").default("agency").notNull(),
    ...defaultColumns,
  },
  (table) => [uniqueIndex("tenant_slug_unique").on(table.slug)],
);

/** Mutable organization/provider profile belonging to exactly one tenant. */
export const tenantProfile = pgTable("tenant_profile", {
  tenantId: uuid("tenant_id")
    .primaryKey()
    .references(() => tenant.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  notificationEmail: text("notification_email").notNull(),
  isInquiryFormEnabled: boolean("is_inquiry_form_enabled")
    .default(true)
    .notNull(),
  ...defaultColumns,
});

export const tenantMembership = pgTable(
  "tenant_membership",
  {
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenant.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: tenantRole("role").default("member").notNull(),
    ...defaultColumns,
  },
  (table) => [primaryKey({ columns: [table.tenantId, table.userId] })],
);

export type Tenant = typeof tenant.$inferSelect;
export type TenantType = (typeof tenantTypeValues)[number];
export type TenantProfile = typeof tenantProfile.$inferSelect;
export type TenantMembership = typeof tenantMembership.$inferSelect;
