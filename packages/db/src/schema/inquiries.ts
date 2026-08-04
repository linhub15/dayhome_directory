import { relations } from "drizzle-orm";
import {
  date,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { defaultColumns } from "./columns.ts";
import { tenant } from "./tenancy.ts";

export const careTypeValues = ["full_time", "part_time", "drop_in"] as const;
export const careType = pgEnum("care_type", careTypeValues);

export const inquiryStatusValues = ["new"] as const;
export const inquiryStatus = pgEnum("inquiry_status", inquiryStatusValues);

export const inquiry = pgTable(
  "inquiry",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenant.id, { onDelete: "cascade" }),
    status: inquiryStatus("status").default("new").notNull(),
    parentFirstName: text("parent_first_name").notNull(),
    parentLastName: text("parent_last_name").notNull(),
    parentEmail: text("parent_email").notNull(),
    careType: careType("care_type").notNull(),
    childBirthDate: date("child_birth_date", { mode: "string" }).notNull(),
    preferredStartDate: date("preferred_start_date", { mode: "string" }),
    parentConfirmationSentAt: timestamp("parent_confirmation_sent_at", {
      withTimezone: true,
    }),
    providerNotificationSentAt: timestamp("provider_notification_sent_at", {
      withTimezone: true,
    }),
    ...defaultColumns,
  },
  (table) => [
    index("inquiry_tenant_created_at_idx").on(table.tenantId, table.createdAt),
    index("inquiry_tenant_status_idx").on(table.tenantId, table.status),
  ],
);

export const inquiryRelations = relations(inquiry, ({ one }) => ({
  tenant: one(tenant, {
    fields: [inquiry.tenantId],
    references: [tenant.id],
  }),
}));

export type InquiryRecord = typeof inquiry.$inferSelect;
