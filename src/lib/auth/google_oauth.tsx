import { Button } from "@/components/ui/button.tsx";
import { authClient } from "@/lib/auth/better_auth_client.ts";
import type { FileRoutesByTo } from "@/routeTree.gen.ts";

type Props = {
  redirect?: keyof FileRoutesByTo;
};

export function GoogleOAuth(props: Props) {
  const defaultRedirect = "/profile" satisfies keyof FileRoutesByTo;

  const signIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: props.redirect ?? defaultRedirect,
    });
  };

  return <Button onClick={signIn}>Continue with Google</Button>;
}
