import { LinkButton } from "@/components/ui/button";
import { authClient } from "@/lib/auth/better_auth_client.ts";
import { ProfileAvatar } from "@/lib/auth/profile_avatar";
import { useLocation } from "@tanstack/react-router";

export function Nav() {
  const { data: session } = authClient.useSession();
  const location = useLocation();
  const onLoginPage = location.pathname.includes("/login");

  return (
    <nav className="mt-3 px-2 sm:mx-auto max-w-xl">
      <div className="flex justify-between items-center w-full">
        <div className="flex gap-4 w-fit">
          <LinkButton
            variant="ghost"
            to="/home"
            activeProps={{ className: "underline" }}
          >
            Home
          </LinkButton>
          <LinkButton
            variant="ghost"
            to="/info"
            activeProps={{ className: "underline" }}
          >
            Info
          </LinkButton>
          <LinkButton
            variant="ghost"
            to="/map"
            activeProps={{ className: "underline" }}
          >
            Map
          </LinkButton>
        </div>

        <div>
          {!onLoginPage && !session && (
            <LinkButton to="/login">Login</LinkButton>
          )}
          <ProfileAvatar />
        </div>
      </div>
    </nav>
  );
}
