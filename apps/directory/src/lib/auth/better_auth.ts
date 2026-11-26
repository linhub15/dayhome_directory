import { getDb, withDb } from "@/lib/db/database.ts";
import {
  createDayhomeAuth,
  dayhomeAuthOptionsFromEnv,
} from "@dayhome/auth/server";

export function getAuth(database = getDb()) {
  return createDayhomeAuth({
    database,
    ...dayhomeAuthOptionsFromEnv(process.env),
  });
}

export function withAuth<T>(
  run: (auth: ReturnType<typeof getAuth>) => Promise<T>,
) {
  return withDb((database) => run(getAuth(database)));
}
