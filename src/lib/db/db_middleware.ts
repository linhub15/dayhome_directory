import { getDb } from "@/lib/db/database.ts";
import { createMiddleware } from "@tanstack/react-start";

export const db = createMiddleware({ type: "request" }).server(
  async ({ next }) => {
    return await next({
      context: {
        db: getDb(),
      },
    });
  },
);
