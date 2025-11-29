import { AppLayout } from "@/components/blocks/layouts/app_layout";
import { Button, LinkButton } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { RevokeClaimButton } from "@/features/claim_listing/revoke_claim_button";
import { useListingClaims } from "@/features/claim_listing/use_listing_claims";
import { CreateVacancyButton } from "@/features/show_vacancy/create_vacancy_button.tsx";
import { VacancyNotice } from "@/features/show_vacancy/vacancy_notice.tsx";
import { authClient } from "@/lib/auth/better_auth_client.ts";
import { getSessionFn } from "@/lib/auth/get_session_fn.ts";
import { ProfileAvatar } from "@/lib/auth/profile_avatar";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { EllipsisVerticalIcon, MapPinnedIcon } from "lucide-react";

export const Route = createFileRoute("/profile/")({
  component: RouteComponent,
  beforeLoad: async () => {
    const { user } = await getSessionFn();
    if (!user) {
      throw redirect({ to: "/login", search: { redirect: "/profile" } });
    }
  },
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data } = authClient.useSession();

  const { data: listingClaims } = useListingClaims();

  const signout = () => {
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
    queryClient.clear();
  };

  if (!data) return; // Skeleton loader

  const { user } = data;

  return (
    <AppLayout>
      <div className="space-y-8">
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
            <CardTitle>My claimed listings</CardTitle>
          </CardHeader>
          <CardContent>
            {listingClaims?.length === 0 && (
              <div className="flex justify-between items-center">
                <span>Find and claim your childcare program from the map.</span>
                <LinkButton to="/map" variant="outline">
                  <MapPinnedIcon />
                  Map
                </LinkButton>
              </div>
            )}
            {listingClaims?.map((claim) => (
              <div
                key={claim.dayhomeId}
                className="flex items-center justify-between"
              >
                <div className="flex flex-col">
                  <VacancyNotice dayhomeId={claim.dayhomeId} />
                  <div>{claim.dayhome?.name}</div>
                </div>
                <div className="flex gap-2">
                  <LinkButton
                    variant="outline"
                    to="/directory/$id"
                    params={{ id: claim.dayhomeId }}
                  >
                    View
                  </LinkButton>
                  <CreateVacancyButton dayhomeId={claim.dayhomeId} />
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline">
                        <EllipsisVerticalIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit">
                      <div>
                        <RevokeClaimButton dayhomeId={claim.dayhomeId} />
                      </div>
                    </PopoverContent>
                  </Popover>
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
    </AppLayout>
  );
}
