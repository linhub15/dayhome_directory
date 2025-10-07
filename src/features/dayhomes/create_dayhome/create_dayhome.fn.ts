import { db } from "@/lib/db/db_middleware";
import { dayhome } from "@/lib/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { createInsertSchema } from "drizzle-zod";
import z from "zod";

const requestSchema = createInsertSchema(dayhome);

export type CreateDayhomRequest = z.infer<typeof requestSchema>;

export const createDayhomeFn = createServerFn({ method: "POST" })
  .middleware([db])
  .inputValidator(requestSchema)
  .handler(async ({ data, context }) => {
    const { db } = context;

    await db.insert(dayhome)
      .values({
        name: data.name,
        address: data.address,
        location: data.location,
      });
  });
