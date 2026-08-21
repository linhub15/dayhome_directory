import { AgeGroupSchema } from "@dayhome/core/dayhome";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { db } from "@/lib/db/db_middleware.ts";
import { log } from "@/lib/observability/log_middleware.ts";
import { listDayhomes } from "./list_dayhomes.server.ts";

const cacheName = "dayhome_directory";
const cacheKey = "https://discovercare.ca/api/dayhomes";
const cacheControl = "public, max-age=3600";

const ListDayhomeSchema = z.object({
  id: z.string(),
  name: z.string(),
  isLicensed: z.boolean(),
  licenseId: z.string().nullable(),
  ageGroups: z.array(AgeGroupSchema).nullable(),
  location: z.object({
    x: z.number(),
    y: z.number(),
  }),
  hasVacancy: z.boolean(),
});

const ListDayhomesSchema = z.array(ListDayhomeSchema);

export type ListDayhomesData = z.infer<typeof ListDayhomesSchema>;

export const listDayhomesFn = createServerFn({ method: "GET" })
  .middleware([log, db])
  .handler(async ({ context }) => {
    const cache = await getCloudflareCache();
    const cachedDayhomes = await readCachedDayhomes(cache);

    if (cachedDayhomes) {
      return cachedDayhomes;
    }

    const dayhomes = ListDayhomesSchema.parse(await listDayhomes(context.db));
    await cacheDayhomes(cache, dayhomes);

    return dayhomes;
  });

async function getCloudflareCache() {
  try {
    return await globalThis.caches.open(cacheName);
  } catch (error) {
    console.warn("Cloudflare cache is unavailable", error);
    return;
  }
}

async function readCachedDayhomes(cache: Cache | undefined) {
  if (!cache) return;

  try {
    const cachedResponse = await cache.match(cacheKey);
    if (!cachedResponse) return;

    const result = ListDayhomesSchema.safeParse(await cachedResponse.json());
    if (result.success) return result.data;

    await cache.delete(cacheKey);
    return;
  } catch (error) {
    console.warn("Unable to read the cached dayhomes", error);
    return;
  }
}

async function cacheDayhomes(
  cache: Cache | undefined,
  dayhomes: ListDayhomesData,
) {
  if (!cache) return;

  try {
    await cache.put(
      cacheKey,
      Response.json(dayhomes, {
        headers: { "Cache-Control": cacheControl },
      }),
    );
  } catch (error) {
    console.warn("Unable to cache the dayhomes", error);
  }
}
