import { getAuth } from "@/lib/auth/better_auth.ts";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: ({ request }) => {
        return getAuth().handler(request);
      },
      POST: ({ request }) => {
        return getAuth().handler(request);
      },
    },
  },
});
