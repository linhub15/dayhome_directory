import "dotenv/config.js";
import { createDatabase } from "@dayhome/db/client";
import { dayhome, dayhomeVacancy } from "@dayhome/db/schema";
import { asc, sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { rename, rm, writeFile } from "node:fs/promises";
import z from "zod";
import { ListDayhomesSchema } from "../src/features/dayhomes/dayhome_map/list_dayhomes_schema.ts";

const database = createDatabase(z.url().parse(process.env.DATABASE_URL));
const rows = await database
  .select({
    id: dayhome.id,
    name: dayhome.name,
    isLicensed: dayhome.isLicensed,
    ageGroups: dayhome.ageGroups,
    location: dayhome.location,
    hasVacancy: sql<boolean>`exists (
      select 1 from ${dayhomeVacancy}
      where ${dayhomeVacancy.dayhomeId} = ${dayhome.id}
        and ${dayhomeVacancy.startOn} <= current_date
        and ${dayhomeVacancy.endOn} >= current_date
        and ${dayhomeVacancy.deletedAt} is null
    )`,
  })
  .from(dayhome)
  .where(
    sql`ST_Within(
      ST_SetSRID(${dayhome.location}, 4326),
      ST_MakeEnvelope(-113.715512, 53.335624, -113.270719, 53.71737, 4326)
    )`,
  )
  .orderBy(asc(dayhome.id))
  .limit(1000)
  .finally(() => database.$client.end());

const markers = ListDayhomesSchema.parse(rows);
const output = new URL("../public/map.json", import.meta.url);
const temporaryOutput = new URL(`./.map_${randomUUID()}.tmp`, output);

try {
  const markersJson = markers
    .map((marker) => JSON.stringify(marker))
    .join(",\n");
  await writeFile(temporaryOutput, `[\n${markersJson}\n]\n`);
  await rename(temporaryOutput, output);
} finally {
  await rm(temporaryOutput, { force: true });
}

console.info(`Exported ${markers.length} map markers.`);
