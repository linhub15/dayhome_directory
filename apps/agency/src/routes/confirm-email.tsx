import { AccountSummary, AuthPage } from "@dayhome/auth/components";
import { Button } from "@dayhome/ui/button";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";

import { getAgencySessionFn } from "#/lib/auth/agency_session.fn";
import { authClient } from "#/lib/auth/better_auth_client";

export const Route = createFileRoute("/confirm-email")({
  beforeLoad: async () => {
    const session = await getAgencySessionFn();
    if (!session.user) throw redirect({ to: "/login" });
    if (session.user.emailVerified) throw redirect({ to: "/auth/complete" });
    return session;
  },
  component: ConfirmEmailPage,
});

function ConfirmEmailPage() {
  const { user } = Route.useRouteContext();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<string>();

  if (!user) return null;

  const sendConfirmation = async () => {
    setPending(true);
    setMessage(undefined);
    setError(undefined);
    const result = await authClient.sendVerificationEmail({
      email: user.email,
      callbackURL: "/auth/complete",
    });
    if (result.error)
      setError(result.error.message ?? "Could not send the confirmation email");
    else setMessage("Confirmation sent. Check your inbox and spam folder.");
    setPending(false);
  };

  return (
    <AuthPage
      title="Confirm your email"
      description="Confirm your email address before creating or opening an agency workspace."
    >
      <div className="grid gap-5">
        <AccountSummary
          name={user.name}
          email={user.email}
          image={user.image}
        />
        <p className="m-0 text-sm leading-6 text-muted-foreground">
          Google normally confirms this automatically. If your account still
          needs confirmation, we’ll email you a secure one-hour link.
        </p>
        <Button className="h-11" disabled={pending} onClick={sendConfirmation}>
          {pending ? "Sending…" : "Send confirmation email"}
        </Button>
        {message ? (
          <output className="m-0 text-sm text-[#34705e]">{message}</output>
        ) : null}
        {error ? (
          <p className="m-0 text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </AuthPage>
  );
}
