import { Button } from "@/components/ui/button.tsx";
import { authClient } from "@/lib/auth/better_auth_client.ts";
import type { FileRoutesByTo } from "@/routeTree.gen.ts";

export function GoogleOAuth() {
  const signIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/profile" satisfies keyof FileRoutesByTo,
    });
  };

  return <Button onClick={signIn}>Continue with Google</Button>;
}
