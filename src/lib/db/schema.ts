import { relations, sql } from "drizzle-orm";
import {
  boolean,
  check,
  date,
  geometry,
  pgEnum,
  pgTable,
  primaryKey,
  smallint,
  text,
  time,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { nanoid } from "@/lib/utils/nanoid.ts";

/// Helpers
export const defaultColumns = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at"),
} as const;

/// Tables

export const ageGroup = pgEnum("age_group", [
  "infant",
  "toddler",
  "preschool",
  "kindergarten",
  "grade_school",
]);

export const dayhome = pgTable("dayhome", {
  id: text("id").primaryKey().$default(nanoid),
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
  licenseId: text("license_id").references(() => license.id, {
    onUpdate: "cascade",
  }),
  agencyName: text("agency_name"),
  ageGroups: ageGroup("age_groups").array(),
  ...defaultColumns,
});

export const dayhomeOpenHours = pgTable(
  "dayhome_open_hours",
  {
    dayhomeId: text("dayhome_id")
      .notNull()
      .references(() => dayhome.id, {
        onDelete: "cascade",
      }),
    /** ISO-8601 Monday is 1*/
    weekday: smallint("weekday").notNull().$type<1 | 2 | 3 | 4 | 5 | 6 | 7>(),
    openAt: time("open_at").notNull(),
    closeAt: time("close_at").notNull(),
    ...defaultColumns,
  },
  (table) => [
    primaryKey({ columns: [table.dayhomeId, table.weekday] }),
    check("weekday_check", sql`${table.weekday} BETWEEN 1 AND 7`),
    unique("dayome_weekday_unique").on(table.dayhomeId, table.weekday),
  ],
);

export const dayhomeRelations = relations(dayhome, ({ one, many }) => ({
  license: one(license, {
    fields: [dayhome.licenseId],
    references: [license.id],
  }),
  openHours: many(dayhomeOpenHours),
  vancancies: many(dayhomeVacancy),
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

export const dayhomeVacancy = pgTable(
  "dayhomeVacancy",
  {
    dayhomeId: text("dayhome_id")
      .references(() => dayhome.id, { onDelete: "cascade" })
      .notNull(),
    startOn: date("start_on").defaultNow().notNull(),
    endOn: date("end_on").notNull(),
    ...defaultColumns,
  },
  (table) => [primaryKey({ columns: [table.dayhomeId, table.startOn] })],
);

export const dayhomeVacancyRelations = relations(dayhomeVacancy, ({ one }) => ({
  dayhome: one(dayhome, {
    fields: [dayhomeVacancy.dayhomeId],
    references: [dayhome.id],
  }),
}));

export const license = pgTable("license", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  postalCode: text("postal_code").notNull(),
  phoneNumber: text("phone_number"),
  type: text("type", {
    enum: [
      "FACILITY-BASED PROGRAM",
      "INNOVATIVE CHILD CARE PROGRAM",
      "FAMILY DAY HOME",
      "GROUP FAMILY CHILD CARE PROGRAM",
    ],
  }).notNull(),
  hasDayCare: boolean("has_day_care").notNull().default(false),
  hasOutOfSchoolCare: boolean("has_out_of_school_care")
    .notNull()
    .default(false),
  hasPreschool: boolean("has_preschool").notNull().default(false),
  capacity: smallint("capacity").notNull().default(0),
  ...defaultColumns,
});

export const licenseRelations = relations(license, ({ many }) => ({
  dayhomes: many(dayhome),
}));

export const geocodeCache = pgTable("geocode_cache", {
  query: text("query").notNull().primaryKey(),
  geometry: geometry("geometry", {
    type: "point",
    mode: "xy",
    srid: 4326,
  }).notNull(),
});
