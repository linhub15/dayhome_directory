import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema/index.ts";

export function createDatabase(databaseUrl: string) {
  const url = new URL(databaseUrl);
  const [endpoint, ...domain] = url.hostname.split(".");

  if (url.hostname.endsWith(".neon.tech") && !endpoint.endsWith("-pooler")) {
    url.hostname = [`${endpoint}-pooler`, ...domain].join(".");
  }

  const client = postgres(url.toString(), {
    max: 1,
    idle_timeout: 10,
    max_lifetime: 60,
  });

  return drizzle(client, {
    schema,
  });
}

export type Database = ReturnType<typeof createDatabase>;
