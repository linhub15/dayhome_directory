import "dotenv/config.js";
import { type InferInsertModel, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "../src/lib/db/schema.ts";
import { saveCache } from "./geocode_cache.ts";
import { dayhomeFromGoogleSheets } from "./importer.ts";
import { geocodeAddress, getGeocodeCount } from "./mapbox_geocode.ts";

const DRY_RUN = false;

async function main() {
  const db = drizzle({
    schema: { ...schema },
    connection: {
      url: process.env.DATABASE_URL,
    },
  });

  if (DRY_RUN) {
    console.info("DRY RUN - not inserting into database");
    console.info(`Inserting - ${dayhomeFromGoogleSheets.length}`);
    return;
  }

  await db.transaction(async (tx) => {
    for (const item of dayhomeFromGoogleSheets) {
      const location = await geocodeAddress(item.Address);

      const inserted = await tx
        .insert(schema.dayhome)
        .values({
          name: item.Name,
          address: item.Address,
          location: { x: location.longitude, y: location.latitude },
          phone: item.Phone,
          email: item.Email,
          agencyName: item["Agency Name"],
          ageGroups: item["Age Groups"],
          isLicensed: item["Is Licensed"] ?? false,
        })
        .returning({
          dayhomeId: schema.dayhome.id,
        });

      console.info(`inserting dayhome ${item.Name}...`);

      const [{ dayhomeId }] = inserted;

      const monday =
        item["M▶️"] && item["M🛑"]
          ? ({
              dayhomeId,
              weekday: 1,
              openAt: item["M▶️"],
              closeAt: item["M🛑"],
            } as const)
          : null;

      const tuesday =
        item["T▶️"] && item["T🛑"]
          ? ({
              dayhomeId,
              weekday: 2,
              openAt: item["T▶️"],
              closeAt: item["T🛑"],
            } as const)
          : null;

      const wednesday =
        item["W▶️"] && item["W🛑"]
          ? ({
              dayhomeId,
              weekday: 3,
              openAt: item["W▶️"],
              closeAt: item["W🛑"],
            } as const)
          : null;

      const thursday =
        item["Th▶️"] && item["Th🛑"]
          ? ({
              dayhomeId,
              weekday: 4,
              openAt: item["Th▶️"],
              closeAt: item["Th🛑"],
            } as const)
          : null;

      const friday =
        item["F▶️"] && item["F🛑"]
          ? ({
              dayhomeId,
              weekday: 5,
              openAt: item["F▶️"],
              closeAt: item["F🛑"],
            } as const)
          : null;

      const saturday =
        item["Sa▶️"] && item["Sa🛑"]
          ? ({
              dayhomeId,
              weekday: 6,
              openAt: item["Sa▶️"],
              closeAt: item["Sa🛑"],
            } as const)
          : null;

      const sunday =
        item["Su▶️"] && item["Su🛑"]
          ? ({
              dayhomeId,
              weekday: 7,
              openAt: item["Su▶️"],
              closeAt: item["Su🛑"],
            } as const)
          : null;

      const openHours: InferInsertModel<typeof schema.dayhomeOpenHours>[] = [
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
        sunday,
      ].filter((x) => x !== null);

      if (openHours.length > 0) {
        await tx.insert(schema.dayhomeOpenHours).values(openHours);
      }
    }
  });

  await db.execute(sql`UPDATE dayhome
    SET location = ST_SetSRID(location, 4326)
    WHERE ST_SRID(location) = 0;`);

  await db.$client.end();

  await saveCache();

  console.info(`Used ${getGeocodeCount()} geocode calls`);
}
/**
 * Note to self:
 * strategy to get parents on board is to have all the daycares and preschools
 * this should get a solid traffic from parents
 *
 * Then dayhome agencies will see the traffic and want to be on board.
 * They are the enterprise and can supply data for free listing.
 *
 *
 * Facility Paid features
 *  - vacancy notification
 *  - waitlist notification
 *  - profile page
 *    - links
 *    - photos
 *    - files
 */

main();
