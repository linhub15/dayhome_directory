import { PinnedMap } from "@/components/ui/pinned_map";
import { getDayhomeFn } from "@/features/dayhomes/get_dayhome.fn";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/directory/$id/")({
  ssr: "data-only",
  component: RouteComponent,
  loader: async ({ params }) => {
    const dayhome = await getDayhomeFn({ data: { id: params.id } });
    if (!dayhome) {
      throw notFound();
    }
    return dayhome;
  },
});

function RouteComponent() {
  const id = Route.useParams().id;
  const { name, location, address, phone, email } = Route.useLoaderData();

  return (
    <div className="max-w-lg mx-auto py-8">
      <div className="border rounded overflow-clip">
        <div className="p-4">
          <h1 className="text-lg">{name}</h1>
        </div>

        <div className="px-4">
          <div>
            {address}
          </div>
          <div>{phone}</div>
          <div>{email}</div>
        </div>

        <div>
          <PinnedMap
            location={{ lat: location.y, lng: location.x }}
          />
        </div>
      </div>

      <div className="mt-4 size-fit mx-auto">
        <Link
          className="rounded block border p-4 text-center hover:bg-gray-50 size-fit"
          to="/directory/$id/edit"
          params={{ id: id }}
        >
          Edit
        </Link>
      </div>
    </div>
  );
}
