import { createMiddleware } from "@tanstack/react-start";

export const log = createMiddleware({ type: "request" }).server(
  async ({ next, request }) => {
    const timestamp = new Date().toISOString();
    try {
      return await next();
    } catch (error) {
      console.error(`[${timestamp} ${request.method} ${request.url}]`, error);
      throw error;
    }
  },
);
