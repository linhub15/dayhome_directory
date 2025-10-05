import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { PinnedMap } from "@/components/ui/pinned_map";
import {
  getDayhomeFn,
  type GetDayhomeResponse,
} from "@/features/dayhomes/get_dayhome.fn";
import { createFileRoute, notFound } from "@tanstack/react-router";

const weekdayIso = {
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
  7: "Sunday",
} as const;

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
  const {
    name,
    location,
    address,
    phone,
    email,
    isLicensed,
    agencyName,
    openHours,
  } = Route
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
          <div>{phone}</div>
          <div>{email}</div>
          <div>{address}</div>

          <PinnedMap
            location={{ lat: location.y, lng: location.x }}
          />
          <div className="py-8">
            <OpenHours openHours={openHours} />
          </div>
        </CardContent>

        <CardFooter>
          <LinkButton to="/directory/$id/edit" params={{ id: id }}>
            Edit
          </LinkButton>
        </CardFooter>
      </Card>
    </div>
  );
}
type OpenHours = GetDayhomeResponse["openHours"];
function OpenHours(
  { openHours }: { openHours: OpenHours },
) {
  const hr = (time: string) => {
    const [hourStr] = time.split(":");
    const hour = Number(hourStr);
    if (hour === 0) return "12 a.m.";
    return hour < 12 ? `${hour} a.m.` : `${hour - 12} p.m.`;
  };

  const format = (openDay?: OpenHours[number]) => {
    if (!openDay) return "Closed";

    return `${hr(openDay.openAt)} - ${hr(openDay.closeAt)}`;
  };

  return (
    <div className="space-y-0.5">
      <h3 className="font-medium py-2">Open Hours</h3>
      {Object.entries(weekdayIso).map(([key, value]) => (
        <div className="grid grid-cols-2" key={key}>
          <span className="text-sm">{value}</span>
          <span>
            {format(openHours.find((x) =>
              x.weekday === Number(key)
            ))}
          </span>
        </div>
      ))}
    </div>
  );
}
