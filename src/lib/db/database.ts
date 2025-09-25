import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

export function getDb() {
  return drizzle({
    schema: { ...schema },
    connection: {
      url: process.env.DATABASE_URL,
    },
  });
}
