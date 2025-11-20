import { authClient } from "@/lib/auth/better_auth_client.ts";
import { GoogleOAuth } from "@/lib/auth/google_oauth.tsx";
import type { FileRoutesByTo } from "@/routeTree.gen.ts";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import z from "@zod/zod";

const searchParams = z.object({
  /** Make sure this is a real path */
  redirect: z
    .string()
    .optional()
    .transform((val) => val as keyof FileRoutesByTo),
});

export const Route = createFileRoute("/(www)/login")({
  validateSearch: searchParams,
  component: RouteComponent,
});

function RouteComponent() {
  const session = authClient.useSession();
  const { redirect } = Route.useSearch();

  if (session.data?.user) {
    return <Navigate to="/profile" />;
  }
  return (
    <div>
      <GoogleOAuth redirect={redirect} />
    </div>
  );
}
