import { Nav } from "@/components/blocks/nav/nav.tsx";
import { Button, LinkButton } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { RevokeClaimButton } from "@/features/claim_listing/revoke_claim_button";
import { useListingClaims } from "@/features/claim_listing/use_listing_claims";
import { CreateVacancyButton } from "@/features/show_vacancy/create_vacancy_button.tsx";
import { ProfileAvatar } from "@/lib/auth/avatar.tsx";
import { authClient } from "@/lib/auth/better_auth_client.ts";
import { getSessionFn } from "@/lib/auth/get_session_fn.ts";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/profile/")({
  component: RouteComponent,
  beforeLoad: async () => {
    // implement this at the top level of protected routest
    // https://tanstack.com/start/latest/docs/framework/solid/guide/authentication#4-route-protection
    const { user } = await getSessionFn();
    if (!user) {
      throw redirect({ to: "/login", search: { redirect: "/profile" } });
    }
  },
});

function RouteComponent() {
  const navigate = useNavigate();

  const { data } = authClient.useSession();

  const { data: listingClaims } = useListingClaims();

  const signout = () =>
    authClient.signOut({
      fetchOptions: {
        onSuccess: async () => {
          await navigate({ to: "/login" });
        },
        onError: (error) => {
          console.error("Error signing out:", error);
        },
      },
    });

  if (!data) return; // Skeleton loader

  const { user } = data;

  return (
    <>
      <Nav />

      <div className="mx-2 sm:mx-auto max-w-lg py-16 space-y-8">
        <Card>
          <CardContent>
            <div className="flex gap-4 items-center">
              <ProfileAvatar className="size-10" />

              <div>
                <div>{user.name}</div>
                <div className="text-muted-foreground text-sm">
                  {user.email}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manage your listings</CardTitle>
          </CardHeader>
          <CardContent>
            {listingClaims?.map((claim) => (
              <div
                key={claim.dayhomeId}
                className="flex items-center justify-between"
              >
                <div>{claim.dayhome?.name}</div>
                <div className="flex gap-2">
                  <LinkButton
                    variant="outline"
                    to="/directory/$id"
                    params={{ id: claim.dayhomeId }}
                  >
                    View
                  </LinkButton>
                  <CreateVacancyButton dayhomeId={claim.dayhomeId} />
                  <RevokeClaimButton dayhomeId={claim.dayhomeId} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="py-8">
          <Button className="w-full" type="button" onClick={signout}>
            Sign out
          </Button>
        </div>
      </div>
    </>
  );
}
