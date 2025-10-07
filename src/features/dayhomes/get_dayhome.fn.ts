import { db } from "@/lib/db/db_middleware";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";

const GetDayhomeRequest = z.object({
  id: z.uuid(),
});

export type GetDayhomeResponse = NonNullable<
  Awaited<ReturnType<typeof getDayhomeFn>>
>;

export const getDayhomeFn = createServerFn({ method: "GET" })
  .middleware([db])
  .inputValidator(GetDayhomeRequest)
  .handler(async ({ data, context }) => {
    const { db } = context;

    const dayhome = await db.query.dayhome.findFirst({
      where: (dayhome, { eq }) => eq(dayhome.id, data.id),
      with: {
        openHours: {
          columns: {
            weekday: true,
            openAt: true,
            closeAt: true,
          },
        },
      },
    });

    return dayhome;
  });
