import { serverEnv } from "@/config/server_env";
import * as authSchema from "@/lib/db/auth_schema.ts";
import * as schema from "@/lib/db/schema";
import { drizzle } from "drizzle-orm/postgres-js";

/**
 * db was wrapped in a function because at one point
 * cloudflare workers had an issue with sharing DB connections.
 *
 * Maybe we can bo back to export `const db = drizzle({...})` one day.
 *
 */
export function getDb() {
  return drizzle({
    schema: { ...schema, ...authSchema },
    connection: {
      url: serverEnv.DATABASE_URL,
    },
  });
}
