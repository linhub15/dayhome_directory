import { createServerFn } from "@tanstack/react-start";
import { db } from "@/lib/db/db_middleware.ts";
import { log } from "@/lib/observability/log_middleware.ts";
import { cacheDayhomes, readCachedDayhomes } from "./dayhome_map_cache.ts";
import { listDayhomes } from "./list_dayhomes.server.ts";
import { ListDayhomesSchema } from "./list_dayhomes_schema.ts";

export type { ListDayhomesData } from "./list_dayhomes_schema.ts";

export const listDayhomesFn = createServerFn({ method: "GET" })
  .middleware([log, db])
  .handler(async ({ context }) => {
    const cachedDayhomes = await readCachedDayhomes();

    if (cachedDayhomes) {
      return cachedDayhomes;
    }

    console.log({ event: "dayhome_map_cache_miss" });

    const dayhomes = ListDayhomesSchema.parse(await listDayhomes(context.db));
    await cacheDayhomes(dayhomes);

    return dayhomes;
  });
