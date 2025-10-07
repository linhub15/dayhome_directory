export const dayhomeKeys = {
  all: ["dayhomes"] as const,

  lists: () => [...dayhomeKeys.all, "list"] as const,

  list: (filters: { name?: string }) =>
    [...dayhomeKeys.lists(), { filters }] as const,

  details: () => [...dayhomeKeys.all, "detail"] as const,

  detail: (id: string) => [...dayhomeKeys.details(), id] as const,
};
