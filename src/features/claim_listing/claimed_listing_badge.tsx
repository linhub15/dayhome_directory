import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { useListingClaims } from "@/features/claim_listing/use_listing_claims";
import { authClient } from "@/lib/auth/better_auth_client.ts";
import { Link } from "@tanstack/react-router";
import { InfoIcon, ShieldCheckIcon } from "lucide-react";

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
    <div className="flex gap-2 items-center ">
      <Link className="inline-block" to="/profile">
        <Badge size="lg" variant="outline">
          <ShieldCheckIcon />
          You manage this listing
        </Badge>
      </Link>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            type="button"
            title="Only managers of this Business Profile can make edits."
          >
            <InfoIcon className="size-4 fill-accent" />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <p>Only managers of this listing can post vacancy notice</p>
        </PopoverContent>
      </Popover>
    </div>
  );
}
