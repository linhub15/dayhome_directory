import { serverEnv } from "@/config/server_env";
import "dotenv/config.js";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: ["./src/lib/db/schema.ts", "./src/lib/db/auth_schema.ts"],
  extensionsFilters: ["postgis"],
  dialect: "postgresql",
  dbCredentials: {
    url: serverEnv.DATABASE_URL,
  },
});
