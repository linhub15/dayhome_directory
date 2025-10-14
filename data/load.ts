import "@std/dotenv/load";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "../src/lib/db/schema.ts";
import { dayhomeFromGoogleSheets } from "./importer.ts";
import { InferInsertModel } from "drizzle-orm";
import { forwardGeocode, getGeocodeCount } from "./mapbox_geocode.ts";
import { saveCache } from "./geocode_cache.ts";

async function main() {
  const db = drizzle({
    schema: { ...schema },
    connection: {
      url: Deno.env.get("DATABASE_URL"),
    },
  });

  await db.transaction(async (tx) => {
    for (const item of dayhomeFromGoogleSheets) {
      const location = await forwardGeocode(item.Address);

      const inserted = await tx.insert(schema.dayhome).values({
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

      console.info(`Inserted ${item.Name} dayhomes into the DB`);

      const [{ dayhomeId }] = inserted;

      const monday = item["M▶️"] && item["M🛑"]
        ? {
          dayhomeId,
          weekday: 1,
          openAt: item["M▶️"],
          closeAt: item["M🛑"],
        } as const
        : null;

      const tuesday = item["T▶️"] && item["T🛑"]
        ? {
          dayhomeId,
          weekday: 2,
          openAt: item["T▶️"],
          closeAt: item["T🛑"],
        } as const
        : null;

      const wednesday = item["W▶️"] && item["W🛑"]
        ? {
          dayhomeId,
          weekday: 3,
          openAt: item["W▶️"],
          closeAt: item["W🛑"],
        } as const
        : null;

      const thursday = item["Th▶️"] && item["Th🛑"]
        ? {
          dayhomeId,
          weekday: 4,
          openAt: item["Th▶️"],
          closeAt: item["Th🛑"],
        } as const
        : null;

      const friday = item["F▶️"] && item["F🛑"]
        ? {
          dayhomeId,
          weekday: 5,
          openAt: item["F▶️"],
          closeAt: item["F🛑"],
        } as const
        : null;

      const saturday = item["Sa▶️"] && item["Sa🛑"]
        ? {
          dayhomeId,
          weekday: 6,
          openAt: item["Sa▶️"],
          closeAt: item["Sa🛑"],
        } as const
        : null;

      const sunday = item["Su▶️"] && item["Su🛑"]
        ? {
          dayhomeId,
          weekday: 7,
          openAt: item["Su▶️"],
          closeAt: item["Su🛑"],
        } as const
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

  await saveCache();

  console.info(`Used ${getGeocodeCount()} geocode calls`);
}

await main();

Deno.exit();
