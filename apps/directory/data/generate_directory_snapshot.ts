import "dotenv/config.js";
import { createDatabase } from "@dayhome/db/client";
import { dayhomeVacancy } from "@dayhome/db/schema";
import { cp, mkdir, mkdtemp, rename, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import z from "zod";
import { ListDayhomesSchema } from "../src/features/dayhomes/dayhome_map/list_dayhomes_schema.ts";
import {
  directoryListingPath,
  directoryMapPath,
} from "../src/features/dayhomes/directory_snapshot.ts";
import { getSnapshotDayhomes } from "../src/features/dayhomes/get_dayhome/get_dayhome.server.ts";
import { pattern } from "../src/lib/utils/nanoid.ts";

const appDirectory = join(import.meta.dirname, "..");
const outputDirectory = join(appDirectory, "public_snapshot");
const idSchema = z.nanoid({ pattern });
const databaseUrl = z
  .url()
  .parse(process.env.DIRECTORY_SOURCE_DATABASE_URL ?? process.env.DATABASE_URL);
const database = createDatabase(databaseUrl);

const { listings, vacancies } = await database
  .transaction(
    async (tx) => {
      const listings = await getSnapshotDayhomes(tx);
      const vacancies = await tx
        .selectDistinct({ id: dayhomeVacancy.dayhomeId })
        .from(dayhomeVacancy);
      return { listings, vacancies };
    },
    { isolationLevel: "repeatable read", accessMode: "read only" },
  )
  .finally(() => database.$client.end());

const vacancyIds = new Set(vacancies.map(({ id }) => id));
const markers = ListDayhomesSchema.parse(
  listings
    .filter(
      ({ location: { x, y } }) =>
        x > -113.715512 && x < -113.270719 && y > 53.335624 && y < 53.71737,
    )
    .slice(0, 1000)
    .map(({ id, name, isLicensed, ageGroups, location }) => ({
      id,
      name,
      isLicensed,
      ageGroups,
      location,
      hasVacancy: vacancyIds.has(id),
    })),
);

const stagingDirectory = await mkdtemp(join(appDirectory, ".public_snapshot_"));
try {
  const assetsDirectory = join(stagingDirectory, "assets");
  const previousDirectory = join(stagingDirectory, "previous");
  await cp(join(appDirectory, "public"), assetsDirectory, { recursive: true });
  await mkdir(join(assetsDirectory, "directory_data", "listings"), {
    recursive: true,
  });

  for (const listing of listings) {
    await writeFile(
      join(assetsDirectory, directoryListingPath(idSchema.parse(listing.id))),
      JSON.stringify(listing),
    );
  }
  await writeFile(
    join(assetsDirectory, directoryMapPath),
    JSON.stringify(markers),
  );

  const hasPreviousSnapshot = await rename(
    outputDirectory,
    previousDirectory,
  ).then(
    () => true,
    (error: NodeJS.ErrnoException) => {
      if (error.code !== "ENOENT") throw error;
      return false;
    },
  );
  try {
    await rename(assetsDirectory, outputDirectory);
  } catch (error) {
    if (hasPreviousSnapshot) await rename(previousDirectory, outputDirectory);
    throw error;
  }
} finally {
  await rm(stagingDirectory, { recursive: true, force: true });
}

console.info(
  `Generated ${listings.length} listing files and ${markers.length} map markers.`,
);
