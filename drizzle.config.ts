import { serverEnv } from "@/config/server_env";
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: [
    "./src/lib/db/schema.ts",
  ],
  extensionsFilters: ["postgis"],
  dialect: "postgresql",
  dbCredentials: {
    url: serverEnv.DATABASE_URL,
  },
});
