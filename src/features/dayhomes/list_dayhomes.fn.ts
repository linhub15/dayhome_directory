import { db } from "@/lib/db/db_middleware";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";

const filters = z.object({
  name: z.string().optional(),
});

type Request = z.infer<typeof filters>;

export const listDayhomesFn = createServerFn({ method: "GET" })
  .inputValidator((data: Request) => filters.parse(data))
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
