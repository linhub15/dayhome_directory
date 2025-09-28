import { DayhomeList } from "@/features/dayhomes/dayhome_list/dayhome_list";
import { filterSearchParams } from "@/features/dayhomes/filter_drawer";
import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

type Search = z.infer<typeof filterSearchParams>;

export const Route = createFileRoute("/directory/")({
  ssr: "data-only",
  validateSearch: (search: Search) => filterSearchParams.parse(search),
  component: RouteComponent,
});

function RouteComponent() {
  const searchParams = Route.useSearch();

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-center text-xl py-2">Day Home Directory</h1>
      <DayhomeList filters={searchParams} />
    </div>
  );
}
