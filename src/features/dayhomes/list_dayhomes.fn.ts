import { db } from "@/lib/db/db_middleware";
import { createServerFn } from "@tanstack/react-start";

export const listDayhomesFn = createServerFn({ method: "GET" })
  .middleware([db])
  .handler(async ({ context }) => {
    const { db } = context;

    const result = await db.query.dayhome.findMany({
      limit: 20,
    });

    return result;
  });
