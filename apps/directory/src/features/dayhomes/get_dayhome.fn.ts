import { getDayhome } from "./get_dayhome/get_dayhome.server";
import { db } from "@/lib/db/db_middleware";
import { pattern } from "@/lib/utils/nanoid";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";

const GetDayhomeRequest = z.object({
  id: z.nanoid({ pattern }),
});

export type GetDayhomeResponse = NonNullable<
  Awaited<ReturnType<typeof getDayhomeFn>>
>;

export const getDayhomeFn = createServerFn({ method: "GET" })
  .middleware([db])
  .validator(GetDayhomeRequest)
  .handler(async ({ data, context }) => {
    const { db } = context;

    return await getDayhome(db, data.id);
  });
