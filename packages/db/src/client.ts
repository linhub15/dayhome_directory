import { drizzle } from "drizzle-orm/postgres-js";

import * as schema from "./schema/index.ts";

export function createDatabase(databaseUrl: string) {
  return drizzle({
    schema,
    connection: { url: databaseUrl },
  });
}

export type Database = ReturnType<typeof createDatabase>;
