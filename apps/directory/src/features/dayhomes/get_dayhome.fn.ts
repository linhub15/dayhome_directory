import {
  getDayhome,
  type PublicDayhome,
} from "./get_dayhome/get_dayhome.server";
import { directoryListingPath } from "./directory_snapshot.ts";
import { db } from "@/lib/db/db_middleware";
import { withDb } from "@/lib/db/database.ts";
import { admin } from "@/lib/auth/admin_middleware.ts";
import { pattern } from "@/lib/utils/nanoid";
import { createServerFn } from "@tanstack/react-start";
import { getRequestUrl } from "@tanstack/react-start/server";
import { env } from "cloudflare:workers";
import z from "zod";

const GetDayhomeRequest = z.object({
  id: z.nanoid({ pattern }),
});

export type GetDayhomeResponse = PublicDayhome;

export const getDayhomeFn = createServerFn({ method: "GET" })
  .validator(GetDayhomeRequest)
  .handler(async ({ data }) => {
    if (import.meta.env.MODE !== "directory_snapshot") {
      return withDb(async (database) => getDayhome(database, data.id));
    }

    const url = new URL(directoryListingPath(data.id), getRequestUrl());
    const response = await env.ASSETS.fetch(url);
    if (response.status === 404) return;
    if (!response.ok)
      throw new Error("Unable to load the directory listing snapshot");
    return response.json<PublicDayhome>();
  });

export const getAdminDayhomeFn = createServerFn({ method: "GET" })
  .middleware([admin, db])
  .validator(GetDayhomeRequest)
  .handler(async ({ data, context }) => {
    const { db } = context;

    return await getDayhome(db, data.id);
  });
