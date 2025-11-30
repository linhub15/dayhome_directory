import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { authClient } from "@/lib/auth/better_auth_client.ts";
import { Link, useLocation } from "@tanstack/react-router";

export function ProfileAvatar({
  className,
  navigate = false,
}: {
  className?: string;
  navigate?: boolean;
}) {
  const location = useLocation();
  const { data } = authClient.useSession();

  if (!data) {
    return;
  }

  const { user } = data;

  const renderAsLink = navigate || location.pathname !== "/profile";

  const component = (
    <Avatar className={className}>
      <AvatarImage src={user.image ?? ""} alt={user.name} />
      <AvatarFallback>{user.name.at(0)}</AvatarFallback>
    </Avatar>
  );

  return renderAsLink ? (
    <Link className="block rounded-full hover:bg-accent p-1" to={"/profile"}>
      {component}
    </Link>
  ) : (
    <div className="rounded-full p-1">{component}</div>
  );
}
