import { auth } from "@/lib/auth/auth_middleware.ts";
import { createServerFn } from "@tanstack/react-start";

export const getSessionFn = createServerFn({ method: "GET" })
  .middleware([auth])
  .handler(async ({ context }) => {
    return { user: context.user };
  });
