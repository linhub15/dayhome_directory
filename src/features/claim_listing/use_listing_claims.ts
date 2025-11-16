import { listClaimsFn } from "@/features/claim_listing/list_claims.fn";
import { listingClaimKeys } from "@/features/claim_listing/query_keys";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

export function useListingClaims() {
  const listClaims = useServerFn(listClaimsFn);

  return useQuery({
    queryKey: listingClaimKeys.list(),
    queryFn: async () => {
      const claims = await listClaims();
      return claims;
    },
  });
}
