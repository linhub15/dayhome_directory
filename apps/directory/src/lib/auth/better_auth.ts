import { getDb } from "@/lib/db/database.ts";
import {
  createDayhomeAuth,
  dayhomeAuthOptionsFromEnv,
} from "@dayhome/auth/server";

export function getAuth() {
  const db = getDb();

  return createDayhomeAuth({
    database: db,
    ...dayhomeAuthOptionsFromEnv(process.env),
  });
}
