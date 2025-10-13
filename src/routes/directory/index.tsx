import { DayhomeList } from "@/features/dayhomes/dayhome_list/dayhome_list";
import {
  DayhomeSearch,
  filterSearchParams,
} from "@/features/dayhomes/dayhome_search";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/directory/")({
  ssr: "data-only",
  validateSearch: filterSearchParams,
  component: RouteComponent,
});

function RouteComponent() {
  const searchParams = Route.useSearch();

  return (
    <div className="max-w-xl mx-auto">
      <div className="py-2 mb-6 px-2">
        <DayhomeSearch value={searchParams.postalCode} />
      </div>
      <DayhomeList filters={searchParams} />
    </div>
  );
}
