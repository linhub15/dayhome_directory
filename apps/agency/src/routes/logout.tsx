import { AccountSummary, AuthPage } from "@dayhome/auth/components";
import { Button } from "@dayhome/ui/button";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { getAgencySessionFn } from "#/lib/auth/agency_session.fn";
import { authClient } from "#/lib/auth/better_auth_client";

export const Route = createFileRoute("/logout")({
  beforeLoad: async () => {
    const session = await getAgencySessionFn();
    if (!session.user) throw redirect({ to: "/login" });
    return session;
  },
  component: LogoutPage,
});

function LogoutPage() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();

  if (!user) return null;

  const signOut = async () => {
    setPending(true);
    setError(undefined);
    const result = await authClient.signOut();
    if (result.error) {
      setError(result.error.message ?? "Could not sign out");
      setPending(false);
      return;
    }
    await navigate({ to: "/login", replace: true });
  };

  return (
    <AuthPage
      title="Log out"
      description="You’ll need to use Google again to return to your agency workspace."
    >
      <div className="grid gap-5">
        <AccountSummary
          name={user.name}
          email={user.email}
          image={user.image}
        />
        <Button className="h-11" disabled={pending} onClick={signOut}>
          {pending ? "Logging out…" : "Log out"}
        </Button>
        {error ? (
          <p className="m-0 text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </AuthPage>
  );
}
