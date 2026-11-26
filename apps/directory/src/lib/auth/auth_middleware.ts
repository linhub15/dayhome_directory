import { withAuth } from "@/lib/auth/better_auth.ts";
import { isRedirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";

export const auth = createMiddleware({ type: "request" }).server(
  async ({ next, request }) => {
    const { headers } = request;
    const session = await withAuth((auth) => auth.api.getSession({ headers }));

    // return optional user to allow each serverFn to handle auth as needed
    const result = await next({
      context: {
        user: session?.user,
      },
    });

    // WORKAROUND for throwing redrects
    if ("error" in result && isRedirect(result.error)) {
      throw result.error;
    }

    return result;
  },
);
