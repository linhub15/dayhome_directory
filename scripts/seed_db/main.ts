import "dotenv/config.js";

import { getDb } from "@/lib/db/database.ts";
import {
  dayhome,
  dayhomeOpenHours,
  dayhomeVacancy,
  license,
} from "@/lib/db/schema.ts";
import { sql } from "drizzle-orm";
import { reset } from "drizzle-seed";
import { createInterface } from "readline";
import {
  createDayhome,
  createDayhomeOpenHoursSet,
  createLicense,
} from "scripts/seed_db/factories.ts";

async function seedDb() {
  const db = getDb();

  await reset(db, { dayhome, dayhomeOpenHours, dayhomeVacancy, license });

  const numberOfLicenses = 100;
  const licenses = Array.from({ length: numberOfLicenses }).map(createLicense);

  const numberOfDayhomes = 0.8 * numberOfLicenses;
  const dayhomes = licenses
    .slice(0, numberOfDayhomes)
    .map(({ id, name, type }) =>
      createDayhome({
        agencyName: type === "FAMILY DAY HOME" ? name : undefined,
        licenseId: id,
      }),
    );

  const dayhomeOpenHourSets = dayhomes.map(({ id }) =>
    createDayhomeOpenHoursSet(id),
  );

  await db.insert(license).values(licenses);
  await db.insert(dayhome).values(dayhomes);
  await db.insert(dayhomeOpenHours).values(dayhomeOpenHourSets.flat());

  await db.execute(sql`UPDATE dayhome
SET location = ST_SetSRID(location, 4326)
WHERE ST_SRID(location) = 0;`);

  await db.$client.end();
}

const confirm = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const dbHost = process.env.DATABASE_URL.split("@")[1];
confirm.question(
  `!!! WARNING !!!
Seeding will DELETE ALL DATA from
-> @${dbHost}

Continue y/N (default to N)?: `,
  async (answer) => {
    if (answer.toLowerCase() !== "y") {
      return process.exit(0);
    }
    await seedDb();
  },
);
