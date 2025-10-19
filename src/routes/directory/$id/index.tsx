import { Badge } from "@/components/ui/badge";
import { buttonVariants, LinkButton } from "@/components/ui/button";
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
import { googleDirections } from "@/lib/geocoding/constant_data";
import { weekdayIso } from "@/lib/maps/weekday";
import { cn } from "@/lib/utils/cn";
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
  } = Route
    .useLoaderData();

  return (
    <div className="max-w-xl mx-auto py-8 space-y-6">
      <Card className="overflow-clip">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-lg">{name}</h1>
              <div className="text-xs italic text-slate-700">{agencyName}</div>
            </div>
            {isLicensed &&
              (
                <Badge>
                  <CheckIcon />Licensed
                </Badge>
              )}
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
          <div className="flex gap-3">
            <div className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm">
              <PhoneIcon className="size-4" />
              {phone}
            </div>
            <div className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm">
              <EmailIcon className="size-4" />
              {email}
            </div>
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <div className="flex items-center space-x-2">
              <MapPin />
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
            <PinnedMap
              location={{ lat: location.y, lng: location.x }}
            />
          </div>

          <div className="py-4">
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
            {format(openHours.find((x) =>
              x.weekday === Number(key)
            ))}
          </span>
        </div>
      ))}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-circle-check-icon lucide-circle-check"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function MapPin() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-map-pin-icon lucide-map-pin"
    >
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("lucide lucide-phone-icon lucide-phone", className)}
    >
      <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
    </svg>
  );
}

function EmailIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("lucide lucide-phone-icon lucide-phone", className)}
    >
      <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
      <rect x="2" y="4" width="20" height="16" rx="2" />
    </svg>
  );
}
