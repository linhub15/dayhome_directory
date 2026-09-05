import { env } from "cloudflare:workers";
import {
  ListDayhomesSchema,
  type ListDayhomesData,
} from "./list_dayhomes_schema.ts";

const kvCacheKey = "dayhome_map:list:v1";
const kvCacheTtlSeconds = 60;
const kvExpirationTtlSeconds = 24 * 60 * 60;

export async function readCachedDayhomes() {
  try {
    const cachedDayhomes = await env.DAYHOME_CACHE.get(kvCacheKey, {
      cacheTtl: kvCacheTtlSeconds,
      type: "json",
    });
    if (!cachedDayhomes) return;

    const result = ListDayhomesSchema.safeParse(cachedDayhomes);
    if (result.success) return result.data;

    await env.DAYHOME_CACHE.delete(kvCacheKey);
    return;
  } catch (error) {
    console.warn("Unable to read the KV-cached dayhomes", error);
    return;
  }
}

export async function cacheDayhomes(dayhomes: ListDayhomesData) {
  try {
    await env.DAYHOME_CACHE.put(kvCacheKey, JSON.stringify(dayhomes), {
      expirationTtl: kvExpirationTtlSeconds,
    });
  } catch (error) {
    console.warn("Unable to cache dayhomes in KV", error);
  }
}

export async function invalidateDayhomeMapCache() {
  try {
    await env.DAYHOME_CACHE.delete(kvCacheKey);
  } catch (error) {
    console.warn("Unable to invalidate KV-cached dayhomes", error);
  }
}
