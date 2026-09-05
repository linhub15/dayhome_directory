import { db } from "@/lib/db/db_middleware";
import { dayhome } from "@dayhome/db/schema";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { eq } from "drizzle-orm";
import { invalidateDayhomeMapCache } from "@/features/dayhomes/dayhome_map/dayhome_map_cache.ts";

export const deleteDayhomeFn = createServerFn({ method: "POST" })
  .middleware([db])
  .validator(z.object({ dayhomeId: z.string() }))
  .handler(async ({ data, context }) => {
    const { db } = context;

    await db.delete(dayhome).where(eq(dayhome.id, data.dayhomeId));
    await invalidateDayhomeMapCache();
  });
