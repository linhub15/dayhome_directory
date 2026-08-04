export const vacancyKeys = {
  all: ["dayhomes"] as const,

  lists: () => [...vacancyKeys.all, "list"] as const,

  list: (id: string) => [...vacancyKeys.lists(), id] as const,
};
