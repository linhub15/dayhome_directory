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
import { user } from "./auth.ts";
import { tenant } from "./tenancy.ts";

export const careTypeValues = ["full_time", "part_time", "drop_in"] as const;
export const careType = pgEnum("care_type", careTypeValues);

export const inquiryStatusValues = [
  "new",
  "contacted",
  "follow_up",
  "registered",
  "closed",
] as const;
export const inquiryStatus = pgEnum("inquiry_status", inquiryStatusValues);

export const expectedStartValues = [
  "as_soon_as_possible",
  "within_a_month",
  "specific_date",
] as const;
export const expectedStart = pgEnum("expected_start", expectedStartValues);

export const inquiry = pgTable(
  "inquiry",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenant.id, { onDelete: "cascade" }),
    status: inquiryStatus("status").default("new").notNull(),
    statusChangedAt: timestamp("status_changed_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    parentFirstName: text("parent_first_name").notNull(),
    parentLastName: text("parent_last_name").notNull(),
    parentEmail: text("parent_email").notNull(),
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

export const inquiryStatusHistory = pgTable(
  "inquiry_status_history",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    inquiryId: uuid("inquiry_id")
      .notNull()
      .references(() => inquiry.id, { onDelete: "cascade" }),
    fromStatus: inquiryStatus("from_status"),
    toStatus: inquiryStatus("to_status").notNull(),
    changedByUserId: text("changed_by_user_id").references(() => user.id, {
      onDelete: "set null",
    }),
    changedAt: timestamp("changed_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("inquiry_status_history_inquiry_changed_at_idx").on(
      table.inquiryId,
      table.changedAt,
    ),
  ],
);

export const inquiryChild = pgTable(
  "inquiry_child",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    inquiryId: uuid("inquiry_id")
      .notNull()
      .references(() => inquiry.id, { onDelete: "cascade" }),
    careType: careType("care_type").notNull(),
    birthDate: date("birth_date", { mode: "string" }).notNull(),
    expectedStart: expectedStart("expected_start")
      .default("as_soon_as_possible")
      .notNull(),
    expectedStartDate: date("expected_start_date", { mode: "string" }),
    ...defaultColumns,
  },
  (table) => [index("inquiry_child_inquiry_id_idx").on(table.inquiryId)],
);

export const inquiryRelations = relations(inquiry, ({ one, many }) => ({
  tenant: one(tenant, {
    fields: [inquiry.tenantId],
    references: [tenant.id],
  }),
  children: many(inquiryChild),
  statusHistory: many(inquiryStatusHistory),
}));

export const inquiryStatusHistoryRelations = relations(
  inquiryStatusHistory,
  ({ one }) => ({
    inquiry: one(inquiry, {
      fields: [inquiryStatusHistory.inquiryId],
      references: [inquiry.id],
    }),
    changedBy: one(user, {
      fields: [inquiryStatusHistory.changedByUserId],
      references: [user.id],
    }),
  }),
);

export const inquiryChildRelations = relations(inquiryChild, ({ one }) => ({
  inquiry: one(inquiry, {
    fields: [inquiryChild.inquiryId],
    references: [inquiry.id],
  }),
}));

export type InquiryRecord = typeof inquiry.$inferSelect;
export type InquiryChildRecord = typeof inquiryChild.$inferSelect;
export type InquiryWithChildren = InquiryRecord & {
  children: InquiryChildRecord[];
};
export type InquiryStatus = (typeof inquiryStatusValues)[number];
export type InquiryStatusHistoryRecord =
  typeof inquiryStatusHistory.$inferSelect;
