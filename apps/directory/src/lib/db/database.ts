import { serverEnv } from "@/config/server_env";
import { createDatabase, type Database } from "@dayhome/db/client";

export function getDb() {
  return createDatabase(serverEnv.DATABASE_URL);
}

export async function withDb<T>(run: (database: Database) => Promise<T>) {
  const database = getDb();
  try {
    return await run(database);
  } finally {
    await database.$client.end();
  }
}
