import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: "../../.env", quiet: true });
config({ path: "../../apps/directory/.env", quiet: true });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required to run database commands");
}

export default defineConfig({
  out: "./drizzle",
  schema: "./src/schema/index.ts",
  extensionsFilters: ["postgis"],
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL },
});
