import "dotenv/config";
import type z from "@zod/zod";
import { saveCache } from "data/geocode_cache.ts";
import { geocodeAddress } from "data/mapbox_geocode.ts";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import { createInsertSchema } from "drizzle-zod";
import * as schema from "@/lib/db/schema.ts";

const db = drizzle({
  schema: { ...schema },
  connection: {
    url: process.env.DATABASE_URL,
  },
});

const result = await db
  .select()
  .from(schema.license)
  .where(
    sql`id NOT IN (SELECT DISTINCT license_id FROM dayhome WHERE license_id IS NOT NULL)`,
  );

const insertSchema = createInsertSchema(schema.dayhome);
const toInsert: z.infer<typeof insertSchema>[] = [];

for (const license of result) {
  const address = `${license.address}, ${license.city}, ${license.postalCode}`;
  const { longitude, latitude } = await geocodeAddress(address);

  toInsert.push({
    name: license.name,
    licenseId: license.id,
    phone: license.phoneNumber,
    address: address,
    isLicensed: true,
    location: { x: longitude, y: latitude },
  });
}

await saveCache();

await db.insert(schema.dayhome).values(toInsert);

db.$client.end();
