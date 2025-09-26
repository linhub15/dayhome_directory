import { db } from "@/lib/db/db_middleware";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";

const GetDayhomeRequest = z.object({
  id: z.uuid(),
});

type Request = z.infer<typeof GetDayhomeRequest>;

export const getDayhomeFn = createServerFn({ method: "GET" })
  .middleware([db])
  .inputValidator((data: Request) => GetDayhomeRequest.parse(data))
  .handler(async ({ data, context }) => {
    const { db } = context;
    const dayhome = await db.query.dayhome.findFirst({
      where: (dayhome, { eq }) => eq(dayhome.id, data.id),
    });

    return dayhome;
  });
