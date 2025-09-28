import { db } from "@/lib/db/db_middleware";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";

const Request = z.object({
  name: z.string().optional(),
});

export const listDayhomesFn = createServerFn({ method: "GET" })
  .inputValidator(Request)
  .middleware([db])
  .handler(async ({ data, context }) => {
    const { db } = context;

    const result = await db.query.dayhome.findMany({
      limit: 20,
      where: data.name
        ? (dayhome, { ilike }) => ilike(dayhome.name, `%${data.name}%`)
        : undefined,
    });

    return result;
  });
