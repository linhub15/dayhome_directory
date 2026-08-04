import { createFileRoute, redirect } from "@tanstack/react-router";

import { getAgencySessionFn } from "#/lib/auth/agency_session.fn";

export const Route = createFileRoute("/auth/complete")({
  beforeLoad: async () => {
    const { user, workspace } = await getAgencySessionFn();
    if (!user) throw redirect({ to: "/login" });
    if (!user.emailVerified) throw redirect({ to: "/confirm-email" });
    if (!workspace) throw redirect({ to: "/onboarding" });
    throw redirect({ to: "/" });
  },
  component: () => null,
});
