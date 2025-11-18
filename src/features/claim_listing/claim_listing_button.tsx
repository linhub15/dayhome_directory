import { Button } from "@/components/ui/button.tsx";
import { claimListingFn } from "@/features/claim_listing/claim_listing.fn";
import { listingClaimKeys } from "@/features/claim_listing/query_keys";
import { useListingClaims } from "@/features/claim_listing/use_listing_claims";
import { authClient } from "@/lib/auth/better_auth_client.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

function useClaimListing() {
  const queryClient = useQueryClient();
  const claimListing = useServerFn(claimListingFn);

  return useMutation({
    mutationFn: async (dayhomeId: string) => {
      await claimListing({ data: { dayhomeId } });
      queryClient.invalidateQueries({ queryKey: listingClaimKeys.list() });
    },
    onError: (error) => {
      alert(error.message);
    },
  });
}

type Props = {
  dayhomeId: string;
};

export function ClaimListingButton({ dayhomeId }: Props) {
  const session = authClient.useSession();
  const { data: claims } = useListingClaims();
  const { mutateAsync } = useClaimListing();

  const claimListing = async () => {
    await mutateAsync(dayhomeId);
  };

  if (session.isPending) return;

  if (!session) return;

  const hasClaimedThisListing = claims?.some(
    (claim) => claim.dayhomeId === dayhomeId,
  );

  if (hasClaimedThisListing) {
    return;
  }

  const hasAtLeastOneListingClaimed = claims && claims?.length > 0;

  if (hasAtLeastOneListingClaimed) return;

  return (
    <Button type="button" onClick={claimListing}>
      Claim this listing
    </Button>
  );
}
