import {
  boolean,
  check,
  geometry,
  integer,
  pgTable,
  primaryKey,
  smallint,
  text,
  time,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

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
  location: geometry("location", {
    type: "point",
    mode: "xy",
    srid: 4326,
  }).notNull(),
  phone: text("phone"),
  email: text("email"),
  isLicensed: boolean("is_licensed").notNull().default(false),
  agencyName: text("agency_name"),
  youngestAgeInMonths: integer("youngest_age_in_months"),
  oldestAgeInMonths: integer("oldest_age_in_months"),
  availableSpots: integer("available_spots"),
  capacity: text("capacity"),
  ...defaultColumns,
});

export const dayhomeOpenHours = pgTable("dayhome_open_hours", {
  dayhomeId: uuid("dayhome_id").notNull().references(() => dayhome.id),
  /** ISO-8601 Monday is 1*/
  weekday: smallint("weekday").notNull().$type<1 | 2 | 3 | 4 | 5 | 6 | 7>(),
  openAt: time("open_at").notNull(),
  closeAt: time("close_at").notNull(),
  ...defaultColumns,
}, (table) => [
  primaryKey({ columns: [table.dayhomeId, table.weekday] }),
  check("weekday_check", sql`${table.weekday} BETWEEN 1 AND 7`),
  unique("dayome_weekday_unique").on(table.dayhomeId, table.weekday),
]);

export const dayhomeRelations = relations(dayhome, ({ many }) => ({
  openHours: many(dayhomeOpenHours),
}));

export const dayhomeOpenHoursRelations = relations(
  dayhomeOpenHours,
  ({ one }) => ({
    dayhome: one(dayhome, {
      fields: [dayhomeOpenHours.dayhomeId],
      references: [dayhome.id],
    }),
  }),
);
