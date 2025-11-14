import "dotenv/config.js";

import * as schema from "@/lib/db/schema.ts";
import { readTextFile } from "@std/fs/unstable-read-text-file";
import z from "@zod/zod";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import { createInsertSchema } from "drizzle-zod";

const text = await readTextFile(
  `${import.meta.dirname}/edmonton_licenses.json`,
);

const json = JSON.parse(text);

const insertSchema = createInsertSchema(schema.license);

const parsed = z.array(insertSchema).parse(json);

const db = drizzle({
  schema: { ...schema },
  connection: {
    url: process.env.DATABASE_URL,
  },
});

await db.insert(schema.license).values(parsed).onConflictDoNothing();

await db.execute(sql`UPDATE dayhome
  SET location = ST_SetSRID(location, 4326)
  WHERE ST_SRID(location) = 0;`);

await db.$client.end();
