import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { admin } from "@/lib/auth/admin_middleware";
import { db } from "@/lib/db/db_middleware";

const requestSchema = z.object({
  query: z.string().trim().optional(),
});

export const listDayhomesAdminFn = createServerFn({ method: "GET" })
  .middleware([admin, db])
  .validator(requestSchema)
  .handler(async ({ context, data }) => {
    const { db } = context;
    const query = data.query?.trim();

    return await db.query.dayhome.findMany({
      where: (item, { ilike, or }) =>
        query?.length
          ? or(
              ilike(item.id, `%${query}%`),
              ilike(item.name, `%${query}%`),
              ilike(item.phone, `%${query}%`),
              ilike(item.email, `%${query}%`),
            )
          : undefined,
      columns: {
        id: true,
        name: true,
        phone: true,
        email: true,
      },
      orderBy: (item, { asc }) => [asc(item.name)],
      limit: 100,
    });
  });
