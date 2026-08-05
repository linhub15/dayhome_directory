import { AuthPage, GoogleAuthButton } from "@dayhome/auth/components";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";

import { authClient } from "#/lib/auth/better_auth_client";
import { getAgencySessionFn } from "#/lib/auth/agency_session.fn";

export const Route = createFileRoute("/create-account")({
  beforeLoad: async () => {
    const session = await getAgencySessionFn();
    if (session.user) throw redirect({ to: "/auth/complete" });
  },
  component: CreateAccountPage,
});

function CreateAccountPage() {
  return (
    <AuthPage
      title="Create your agency account"
      description="Use Google to create a secure account. Next, we’ll set up your agency workspace."
      footer={
        <>
          Already have an account?{" "}
          <Link className="ml-1 font-medium text-primary" to="/login">
            Log in
          </Link>
        </>
      }
    >
      <GoogleAuthButton
        authClient={authClient}
        callbackURL="/auth/complete"
        label="Create account with Google"
      />
      <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">
        By continuing, you agree to use Dayhome Flow for your childcare
        business.
      </p>
    </AuthPage>
  );
}
