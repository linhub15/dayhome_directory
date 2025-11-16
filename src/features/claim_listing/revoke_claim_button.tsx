import { Button } from "@/components/ui/button.tsx";
import { listingClaimKeys } from "@/features/claim_listing/query_keys";
import { revokeClaimFn } from "@/features/claim_listing/revoke_claim.fn";
import { useListingClaims } from "@/features/claim_listing/use_listing_claims";
import { authClient } from "@/lib/auth/better_auth_client.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { FlagOffIcon } from "lucide-react";

function useRevokeClaim() {
  const queryClient = useQueryClient();
  const claimListing = useServerFn(revokeClaimFn);

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

export function RevokeClaimButton({ dayhomeId }: Props) {
  const session = authClient.useSession();
  const { data: claims } = useListingClaims();
  const { mutateAsync } = useRevokeClaim();

  const revoke = async () => {
    await mutateAsync(dayhomeId);
  };

  if (session.isPending) return;

  if (!session) return;

  const hasClaimedThisListing = claims?.some(
    (claim) => claim.dayhomeId === dayhomeId,
  );

  if (!hasClaimedThisListing) return;

  return (
    <Button variant="outline" type="button" onClick={revoke}>
      <FlagOffIcon /> Unclaim
    </Button>
  );
}
