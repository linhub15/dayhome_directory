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
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { customAlphabet } from "nanoid";

import { user } from "./auth.ts";
import { softDeleteColumns } from "./columns.ts";
import { tenant } from "./tenancy.ts";

const createId = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  10,
);

export const ageGroup = pgEnum("age_group", [
  "infant",
  "toddler",
  "preschool",
  "kindergarten",
  "grade_school",
]);

/** A physical childcare location, optionally managed by a tenant. */
export const dayhome = pgTable("dayhome", {
  id: text("id").primaryKey().$default(createId),
  tenantId: uuid("tenant_id").references(() => tenant.id, {
    onDelete: "set null",
  }),
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
  /** Legacy imported value. Use tenantId/profile for managed locations. */
  agencyName: text("agency_name"),
  ageGroups: ageGroup("age_groups").array(),
  ...softDeleteColumns,
});

export const dayhomeOpenHours = pgTable(
  "dayhome_open_hours",
  {
    dayhomeId: text("dayhome_id")
      .notNull()
      .references(() => dayhome.id, { onDelete: "cascade" }),
    /** ISO-8601 Monday is 1. */
    weekday: smallint("weekday").notNull().$type<1 | 2 | 3 | 4 | 5 | 6 | 7>(),
    openAt: time("open_at").notNull(),
    closeAt: time("close_at").notNull(),
    ...softDeleteColumns,
  },
  (table) => [
    primaryKey({ columns: [table.dayhomeId, table.weekday] }),
    check("weekday_check", sql`${table.weekday} BETWEEN 1 AND 7`),
    unique("dayome_weekday_unique").on(table.dayhomeId, table.weekday),
  ],
);

export const dayhomeVacancy = pgTable(
  "dayhome_vacancy",
  {
    dayhomeId: text("dayhome_id")
      .references(() => dayhome.id, { onDelete: "cascade" })
      .notNull(),
    startOn: date("start_on", { mode: "date" }).defaultNow().notNull(),
    endOn: date("end_on", { mode: "date" }).notNull(),
    ...softDeleteColumns,
  },
  (table) => [primaryKey({ columns: [table.dayhomeId, table.startOn] })],
);

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
  ...softDeleteColumns,
});

export const listingClaim = pgTable("listing_claim", {
  dayhomeId: text("dayhome_id")
    .notNull()
    .references(() => dayhome.id),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  ...softDeleteColumns,
});

export const geocodeCache = pgTable("geocode_cache", {
  query: text("query").notNull().primaryKey(),
  geometry: geometry("geometry", {
    type: "point",
    mode: "xy",
    srid: 4326,
  }).notNull(),
});

export const dayhomeRelations = relations(dayhome, ({ one, many }) => ({
  tenant: one(tenant, {
    fields: [dayhome.tenantId],
    references: [tenant.id],
  }),
  license: one(license, {
    fields: [dayhome.licenseId],
    references: [license.id],
  }),
  openHours: many(dayhomeOpenHours),
  vancancies: many(dayhomeVacancy),
  claims: many(listingClaim),
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

export const dayhomeVacancyRelations = relations(dayhomeVacancy, ({ one }) => ({
  dayhome: one(dayhome, {
    fields: [dayhomeVacancy.dayhomeId],
    references: [dayhome.id],
  }),
}));

export const licenseRelations = relations(license, ({ many }) => ({
  dayhomes: many(dayhome),
}));

export const listingClaimRelations = relations(listingClaim, ({ one }) => ({
  dayhome: one(dayhome, {
    fields: [listingClaim.dayhomeId],
    references: [dayhome.id],
  }),
  user: one(user, {
    fields: [listingClaim.userId],
    references: [user.id],
  }),
}));
