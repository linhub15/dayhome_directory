import { drizzle } from "drizzle-orm/postgres-js";
import { serverEnv } from "@/config/server_env";
import * as schema from "./schema";

export function getDb() {
  return drizzle({
    schema: { ...schema },
    connection: {
      url: serverEnv.DATABASE_URL,
    },
  });
}
