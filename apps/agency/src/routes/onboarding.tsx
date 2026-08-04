import { AccountSummary, AuthPage } from "@dayhome/auth/components";
import { Button } from "@dayhome/ui/button";
import { Input } from "@dayhome/ui/input";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

import { createAgencyWorkspaceFn } from "#/features/account/onboarding.fn";
import { getAgencySessionFn } from "#/lib/auth/agency_session.fn";

export const Route = createFileRoute("/onboarding")({
  beforeLoad: async () => {
    const session = await getAgencySessionFn();
    if (!session.user) throw redirect({ to: "/login" });
    if (!session.user.emailVerified) throw redirect({ to: "/confirm-email" });
    if (session.workspace) throw redirect({ to: "/" });
    return session;
  },
  component: OnboardingPage,
});

function OnboardingPage() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const [businessName, setBusinessName] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();

  if (!user) return null;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setPending(true);
    setError(undefined);
    try {
      await createAgencyWorkspaceFn({ data: { businessName } });
      await navigate({ to: "/" });
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Could not create the agency",
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <AuthPage
      title="Set up your agency"
      description="Tell us the business name families and providers should see."
    >
      <form className="grid gap-5" onSubmit={submit}>
        <AccountSummary
          name={user.name}
          email={user.email}
          image={user.image}
        />
        <label
          className="grid gap-2 text-sm font-semibold"
          htmlFor="business-name"
        >
          Business name
          <Input
            id="business-name"
            value={businessName}
            onChange={(event) => setBusinessName(event.target.value)}
            placeholder="Little Sprouts Childcare Agency"
            autoComplete="organization"
            minLength={2}
            maxLength={120}
            required
          />
        </label>
        <div className="rounded-xl border border-[#dce7e0] bg-[#f5f9f6] p-3 text-sm">
          <strong>Business type</strong>
          <p className="mt-1 mb-0 text-xs text-muted-foreground">
            Agency — this selects the agency profile and connected business
            data.
          </p>
        </div>
        {error ? (
          <p className="m-0 text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
        <Button className="h-11" disabled={pending} type="submit">
          {pending ? "Creating agency…" : "Create agency workspace"}
        </Button>
      </form>
    </AuthPage>
  );
}
