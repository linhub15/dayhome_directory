import { DayhomeCard } from "@/features/dayhomes/dayhome_card";
import {
  FilterDrawer,
  filterSearchParams,
} from "@/features/dayhomes/filter_drawer";
import { listDayhomesFn } from "@/features/dayhomes/list_dayhomes.fn";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import z from "zod";

type Search = z.infer<typeof filterSearchParams>;

export const Route = createFileRoute("/")({
  validateSearch: (search: Search) => filterSearchParams.parse(search),
  component: App,
});

function App() {
  const searchParams = Route.useSearch();
  const fn = useServerFn(listDayhomesFn);

  const { data } = useQuery({
    queryKey: ["dayhomes", searchParams.name],
    queryFn: () => fn({ data: searchParams }),
  });

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-center text-xl py-2">Day Home Directory</h1>

      <div className="p-2 space-y-4">
        {data?.map((dayhome) => (
          <DayhomeCard
            key={dayhome.name}
            {...dayhome}
          />
        ))}
      </div>
      <FilterDrawer initialValues={searchParams} />
    </div>
  );
}
