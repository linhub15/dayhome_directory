import { withDb } from "@/lib/db/database.ts";
import { createMiddleware } from "@tanstack/react-start";

export const db = createMiddleware({ type: "request" }).server(
  async ({ next }) => {
    return withDb(async (database) => next({ context: { db: database } }));
  },
);
