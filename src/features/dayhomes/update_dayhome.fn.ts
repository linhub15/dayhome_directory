import { db } from "@/lib/db/db_middleware";
import { dayhome } from "@/lib/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { createUpdateSchema } from "drizzle-zod";
import { eq } from "drizzle-orm";

const updateDayhomeSchema = createUpdateSchema(dayhome)
  .required({ id: true });

export const updateDayhomeFn = createServerFn({ method: "POST" })
  .middleware([db])
  .inputValidator(updateDayhomeSchema)
  .handler(async ({ data, context }) => {
    const { db } = context;
    await db.update(dayhome)
      .set({
        name: data.name,
        email: data.email,
      })
      .where(eq(dayhome.id, data.id));
  });
