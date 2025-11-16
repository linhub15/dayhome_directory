import { authClient } from "@/lib/auth/better_auth_client.ts";
import { GoogleOAuth } from "@/lib/auth/google_oauth.tsx";
import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/(www)/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const session = authClient.useSession();

  if (session.data?.user) {
    // todo: navigate to where they came from in the query params
    return <Navigate to="/profile" />;
  }
  return (
    <div>
      <GoogleOAuth />
    </div>
  );
}
