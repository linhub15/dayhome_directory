import { createDatabase } from "@dayhome/db/client";

let database: ReturnType<typeof createDatabase> | undefined;

export function getDb() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required by the agency app");
  }

  database ??= createDatabase(databaseUrl);
  return database;
}
