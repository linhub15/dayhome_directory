import { getAuth } from "#/lib/auth/better_auth";
import { isRedirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";

export const authMiddleware = createMiddleware({ type: "request" }).server(
  async ({ next, request }) => {
    const session = await getAuth().api.getSession({
      headers: request.headers,
    });
    const result = await next({ context: { user: session?.user } });

    if ("error" in result && isRedirect(result.error)) throw result.error;
    return result;
  },
);
