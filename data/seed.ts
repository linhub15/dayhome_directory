import "dotenv/config";
import { seed } from "drizzle-seed";
import * as schema from "../src/lib/db/schema.ts";
import { drizzle } from "drizzle-orm/postgres-js";

async function main() {
  const db = drizzle(process.env.DATABASE_URL!);
  await seed(db, schema).refine((f) => ({
    dayhome: {
      count: 10,
    },
  }));
}

main();
