import { AppLayout } from "@/components/blocks/layouts/app_layout";
import { Button } from "@dayhome/ui/button";
import { Card, CardContent } from "@dayhome/ui/card";
import { authClient } from "@/lib/auth/better_auth_client.ts";
import { getSessionFn } from "@/lib/auth/get_session_fn.ts";
import { ProfileAvatar } from "@/lib/auth/profile_avatar";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";

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

        <div className="py-8">
          <Button className="w-full" type="button" onClick={signout}>
            Sign out
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
