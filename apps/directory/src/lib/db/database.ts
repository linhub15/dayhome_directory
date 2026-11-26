import { serverEnv } from "@/config/server_env";
import { createDatabase } from "@dayhome/db/client";

let database: ReturnType<typeof createDatabase> | undefined;

export function getDb() {
  database ??= createDatabase(serverEnv.DATABASE_URL);
  return database;
}
