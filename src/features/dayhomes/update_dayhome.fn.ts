import { db } from "@/lib/db/db_middleware";
import { dayhome } from "@/lib/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { createUpdateSchema } from "drizzle-zod";
import { eq } from "drizzle-orm";

const requestSchema = createUpdateSchema(dayhome)
  .pick({
    id: true,
    name: true,
    address: true,
    location: true,
    phone: true,
    email: true,
    isLicensed: true,
  })
  .required({ id: true });

export const updateDayhomeFn = createServerFn({ method: "POST" })
  .middleware([db])
  .inputValidator(requestSchema)
  .handler(async ({ data, context }) => {
    const { db } = context;

    await db.update(dayhome)
      .set({
        name: data.name,
        address: data.address,
        location: data.location,
        phone: data.phone,
        email: data.email,
        isLicensed: data.isLicensed,
      })
      .where(eq(dayhome.id, data.id));
  });
