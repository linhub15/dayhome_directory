import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { PinnedMap } from "@/components/ui/pinned_map";
import { getDayhomeFn } from "@/features/dayhomes/get_dayhome.fn";
import { createFileRoute, notFound } from "@tanstack/react-router";

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
  const { name, location, address, phone, email, isLicensed, agencyName } =
    Route
      .useLoaderData();

  return (
    <div className="max-w-lg mx-auto py-8">
      <Card className="overflow-clip">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-lg">{name}</h1>
              <div className="text-xs italic text-slate-700">{agencyName}</div>
            </div>
            {isLicensed &&
              <Badge>Licensed</Badge>}
          </div>
        </CardHeader>

        <CardContent>
          <div>{address}</div>
          <div>{phone}</div>
          <div>{email}</div>
        </CardContent>

        <PinnedMap
          location={{ lat: location.y, lng: location.x }}
        />

        <CardFooter>
          <LinkButton to="/directory/$id/edit" params={{ id: id }}>
            Edit
          </LinkButton>
        </CardFooter>
      </Card>
    </div>
  );
}
