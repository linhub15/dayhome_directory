import { db } from "@/lib/db/db_middleware";
import { dayhome } from "@/lib/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import z from "zod";

export const deleteDayhomeFn = createServerFn({ method: "POST" })
  .middleware([db])
  .inputValidator(z.object({ dayhomeId: z.string() }))
  .handler(async ({ data, context }) => {
    const { db } = context;

    await db.delete(dayhome)
      .where(eq(dayhome.id, data.dayhomeId));
  });
