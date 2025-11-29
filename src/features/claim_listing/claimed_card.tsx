import { Badge } from "@/components/ui/badge.tsx";
import { LinkButton } from "@/components/ui/button.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { useListingClaims } from "@/features/claim_listing/use_listing_claims.ts";
import { InfoIcon, ShieldCheckIcon } from "lucide-react";

type Props = {
  dayhomeId: string;
};

export function ClaimedCard({ dayhomeId }: Props) {
  const { data, isLoading } = useListingClaims();

  if (isLoading) return;

  const hasClaimedAnotherListing =
    data &&
    data?.length > 0 &&
    data?.some((claim) => claim.dayhomeId !== dayhomeId);

  const hasClaimedThisListing = data?.some(
    (claim) => claim.dayhomeId === dayhomeId,
  );

  const canClaim = !data || data.length === 0;
  return (
    <div className="flex items-center justify-between">
      {hasClaimedAnotherListing && (
        <>
          <ClaimedOtherListingBadge />
          <ManageMyListingsButton />
        </>
      )}
      {hasClaimedThisListing && (
        <>
          <ClaimedThisListingBadge />
          <ManageMyListingsButton />
        </>
      )}
      {canClaim && (
        <>
          <Badge variant="outline">
            <InfoIcon className="size-5 text-muted-foreground" />
            Claim page to post vacancies
          </Badge>
          <ClaimListingButton dayhomeId={dayhomeId} />
        </>
      )}
    </div>
  );
}

function ClaimedOtherListingBadge() {
  return (
    <Badge variant="outline">
      <InfoIcon className="size-5 text-muted-foreground" />
      <span className="text-muted-foreground">Claimed 1 of 1 listings</span>
    </Badge>
  );
}

function ClaimedThisListingBadge() {
  const helpText =
    "Managers of the listing can post vacancy notices. If you want to change your info, please contact us.";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Badge className="border-green-300 bg-green-300" variant="outline">
          <ShieldCheckIcon className="" />
          You manage this listing
        </Badge>
      </PopoverTrigger>
      <PopoverContent>
        <p>{helpText}</p>
        <a className="underline hover:text-primary" href="/home#contact">
          Contact form.
        </a>
      </PopoverContent>
    </Popover>
  );
}

function ManageMyListingsButton() {
  return (
    <LinkButton variant="secondary" to="/profile">
      Manage
    </LinkButton>
  );
}

function ClaimListingButton({ dayhomeId }: { dayhomeId: string }) {
  return (
    <LinkButton
      variant="secondary"
      to="/directory/$id/claim"
      params={{ id: dayhomeId }}
    >
      <ShieldCheckIcon />
      Claim
    </LinkButton>
  );
}
