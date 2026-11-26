import { serverEnv } from "@/config/server_env.ts";
import { getDb } from "@/lib/db/database.ts";
import {
  createDayhomeAuth,
  dayhomeAuthOptionsFromEnv,
} from "@dayhome/auth/server";
import { createDatabase } from "@dayhome/db/client";

export function getAuth(database = getDb()) {
  return createDayhomeAuth({
    database,
    ...dayhomeAuthOptionsFromEnv(process.env),
  });
}

export async function withAuth<T>(
  run: (auth: ReturnType<typeof getAuth>) => Promise<T>,
) {
  const database = createDatabase(serverEnv.DATABASE_URL);
  try {
    return await run(getAuth(database));
  } finally {
    await database.$client.end();
  }
}
