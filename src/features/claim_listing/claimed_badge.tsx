import { Badge } from "@/components/ui/badge.tsx";
import { useListingClaims } from "@/features/claim_listing/use_listing_claims";
import { authClient } from "@/lib/auth/better_auth_client.ts";
import { Link } from "@tanstack/react-router";
import { FlagIcon } from "lucide-react";

type Props = {
  dayhomeId: string;
};

export function ClaimedListingBadge({ dayhomeId }: Props) {
  const session = authClient.useSession();
  const { data: claims } = useListingClaims();

  if (!session) return;

  const hasClaimedThisListing = claims?.some(
    (claim) => claim.dayhomeId === dayhomeId,
  );

  if (!hasClaimedThisListing) return;

  return (
    <Link className="inline-block" to="/profile">
      <Badge className="bg-emerald-600">
        <FlagIcon />
        You claimed this listing
      </Badge>
    </Link>
  );
}
