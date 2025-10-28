import { createMiddleware } from "@tanstack/react-start";
import { getDb } from "./database";

export const db = createMiddleware({ type: "request" }).server(
  async ({ next }) => {
    return await next({
      context: {
        db: getDb(),
      },
    });
  },
);
