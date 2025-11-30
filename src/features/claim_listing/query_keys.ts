export const listingClaimKeys = {
  all: ["listing_claim"] as const,

  lists: () => [...listingClaimKeys.all, "list"] as const,

  /** always specific to current logged in user, when user logs out we should clear this */
  list: () => [...listingClaimKeys.lists()] as const,
};
