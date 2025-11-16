export const listingClaimKeys = {
  all: ["listing_claim"] as const,

  lists: () => [...listingClaimKeys.all, "list"] as const,

  list: () => [...listingClaimKeys.lists()] as const,
};
