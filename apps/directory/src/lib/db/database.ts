import { serverEnv } from "@/config/server_env";
import { createDatabase } from "@dayhome/db/client";

/**
 * db was wrapped in a function because at one point
 * cloudflare workers had an issue with sharing DB connections.
 *
 * Maybe we can bo back to export `const db = drizzle({...})` one day.
 *
 */
export function getDb() {
  return createDatabase(serverEnv.DATABASE_URL);
}
