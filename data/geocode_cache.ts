import { writeTextFile } from "@std/fs/unstable-write-text-file";
import z from "@zod/zod";
import geocodeCache from "./geocode.cache.json" with { type: "json" };

const geocodeCacheFileSchema = z.record(
  z.string(),
  z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
);

let newCacheKeys = 0;

const cache = geocodeCacheFileSchema.parse(geocodeCache);

console.info(`Loaded ${Object.keys(cache).length} cached geocodes`);

function getGeocode(query: string) {
  return cache[query.trim().toLowerCase()];
}

function setGeocode(
  query: string,
  geocode: { latitude: number; longitude: number },
) {
  cache[query.trim().toLowerCase()] = geocode;
  newCacheKeys++;
}

async function saveCache() {
  await writeTextFile(
    `${import.meta.dirname}/geocode.cache.json`,
    JSON.stringify(cache, null, 2),
  );

  console.info(
    `${newCacheKeys} new geocodes cached; Cache total ${
      Object.keys(cache).length
    }`,
  );
}

export { getGeocode, saveCache, setGeocode };
