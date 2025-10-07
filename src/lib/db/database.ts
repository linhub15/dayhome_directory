import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
import { serverEnv } from "@/config/server_env";

export function getDb() {
  return drizzle({
    schema: { ...schema },
    connection: {
      url: serverEnv.DATABASE_URL,
    },
  });
}
