import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/// Helpers
export const defaultColumns = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at"),
} as const;

/// Tables
export const dayhome = pgTable("dayhome", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  phone: text("phone"),
  email: text("email"),
  languages: text("languages").array(),
  ...defaultColumns,
});
