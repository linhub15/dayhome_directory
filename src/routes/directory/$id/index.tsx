import { createFileRoute, notFound } from "@tanstack/react-router";
import { MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { PinnedMap } from "@/components/ui/pinned_map";
import { DayhomeTitle } from "@/features/dayhomes/dayhome_map/components/dayhome_title.tsx";
import { LicensedBadge } from "@/features/dayhomes/dayhome_map/components/licensed_badge.tsx";
import {
  type GetDayhomeResponse,
  getDayhomeFn,
} from "@/features/dayhomes/get_dayhome.fn";
import { weekdayIso } from "@/lib/constants/weekday";
import { googleDirections } from "@/lib/geocoding/constant_data";

export const Route = createFileRoute("/directory/$id/")({
  ssr: "data-only",
  loader: async ({ params }) => {
    const dayhome = await getDayhomeFn({ data: { id: params.id } });
    if (!dayhome) {
      throw notFound();
    }
    return dayhome;
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.name}` }],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const {
    name,
    location,
    address,
    phone,
    email,
    isLicensed,
    agencyName,
    openHours,
    ageGroups,
  } = Route.useLoaderData();

  return (
    <div className="max-w-xl mx-auto py-8 space-y-6">
      <Card className="overflow-clip">
        <CardHeader>
          <div className="flex justify-between items-center">
            <DayhomeTitle name={name} agencyName={agencyName} />
            <LicensedBadge isLicensed={isLicensed} />
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-x-2">
            {ageGroups?.map((ageGroup) => (
              <Badge className="capitalize" variant="secondary" key={ageGroup}>
                {ageGroup.replace("_", " ")}
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter>
          <div className="flex gap-3 overflow-scroll no-scrollbar">
            {phone && (
              <div className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm">
                <PhoneIcon className="size-4" />
                <span>{phone}</span>
              </div>
            )}
            {email && (
              <div className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm">
                <MailIcon className="size-4" />
                <span className="text-nowrap">{email}</span>
              </div>
            )}
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <div className="flex items-top space-x-2">
              <div>
                <MapPinIcon className="size-5 mt-1" />
              </div>
              <div>{address}</div>
            </div>

            <a
              className={buttonVariants({ variant: "outline" })}
              href={googleDirections(address)}
              target="_blank"
            >
              Directions
            </a>
          </div>
        </CardHeader>
        <CardContent>
          <div>
            <PinnedMap location={{ lat: location.y, lng: location.x }} />
          </div>

          <div className="py-4">
            {openHours.length > 0 && <OpenHours openHours={openHours} />}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

type OpenHours = GetDayhomeResponse["openHours"];

function OpenHours({ openHours }: { openHours: OpenHours }) {
  const hr = (time: string) => {
    const [hourStr, minuteStr] = time.split(":");
    const hour = Number(hourStr);
    const minute = Number(minuteStr);

    const displayHour = hour === 0 ? 12 : hour <= 12 ? hour : hour - 12;
    const displayMinute = minute ? `:${minuteStr}` : "";

    return hour < 12
      ? `${displayHour}${displayMinute} a.m.`
      : `${displayHour}${displayMinute} p.m.`;
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
            {format(openHours.find((x) => x.weekday === Number(key)))}
          </span>
        </div>
      ))}
    </div>
  );
}
