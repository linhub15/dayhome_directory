import type { Database } from "@dayhome/db/client";
import { dayhome, dayhomeVacancy } from "@dayhome/db/schema";
import { sql } from "drizzle-orm";

export async function listDayhomes(database: Database) {
  return await database
    .select({
      id: dayhome.id,
      name: dayhome.name,
      isLicensed: dayhome.isLicensed,
      licenseId: dayhome.licenseId,
      ageGroups: dayhome.ageGroups,
      location: dayhome.location,
      hasVacancy: sql<boolean>`exists (
        select 1
        from ${dayhomeVacancy}
        where ${dayhomeVacancy.dayhomeId} = ${dayhome.id}
      )`,
    })
    .from(dayhome)
    .where(
      sql`ST_Within(
        ST_SetSRID(${dayhome.location}, 4326),
        ST_MakeEnvelope(-113.715512, 53.335624, -113.270719, 53.71737, 4326)
      )`,
    )
    .limit(1000);
}
