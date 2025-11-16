import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { authClient } from "@/lib/auth/better_auth_client.ts";
import { Link } from "@tanstack/react-router";

export function ProfileAvatar({
  className,
  navigate = false,
}: {
  className?: string;
  navigate?: boolean;
}) {
  const { data } = authClient.useSession();

  if (!data) return;

  const { user } = data;

  const component = (
    <Avatar className={className}>
      <AvatarImage src={user.image ?? ""} alt={user.name} />
      <AvatarFallback>{user.name.at(0)}</AvatarFallback>
    </Avatar>
  );

  return navigate ? (
    <Link
      className="rounded-full hover:bg-accent p-1.25 size-fit box-content"
      to={"/profile"}
    >
      {component}
    </Link>
  ) : (
    component
  );
}
