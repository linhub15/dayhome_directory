import { AuthPage, GoogleAuthButton } from "@dayhome/auth/components";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";

import { authClient } from "#/lib/auth/better_auth_client";
import { getAgencySessionFn } from "#/lib/auth/agency_session.fn";

export const Route = createFileRoute("/login")({
  beforeLoad: async () => {
    const session = await getAgencySessionFn();
    if (session.user) throw redirect({ to: "/auth/complete" });
  },
  component: LoginPage,
});

function LoginPage() {
  return (
    <AuthPage
      title="Welcome back"
      description="Sign in to manage your agency, providers, and family inquiries."
      footer={
        <>
          New to Dayhome Flow?{" "}
          <Link
            className="ml-1 font-semibold text-primary"
            to="/create-account"
          >
            Create an account
          </Link>
        </>
      }
    >
      <GoogleAuthButton
        authClient={authClient}
        callbackURL="/auth/complete"
        label="Log in with Google"
      />
    </AuthPage>
  );
}
