import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PinnedMap } from "@/components/ui/pinned_map";

type Props = {
  name: string;
  address: string;
  phone: string | null;
  location: { x: number; y: number } | null;
  isLicensed: boolean;
  youngestAgeInMonths: number | null;
  oldestAgeInMonths: number | null;
  capacity: string | null;
  availableSpots: number | null;
};

export function DayhomeListCard(props: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>{props.name}</div>
          {props.isLicensed &&
            <Badge>Licensed</Badge>}
        </div>
        <div className="text-slate-600 text-sm">{props.address}</div>
        {props.youngestAgeInMonths && props.oldestAgeInMonths && (
          <AgeRangeChip
            startMonths={props.youngestAgeInMonths}
            endMonths={props.oldestAgeInMonths}
          />
        )}
        <div className="text-slate-600 text-sm">{props.phone}</div>
      </CardHeader>
      <CardContent>
        {props.location &&
          (
            <PinnedMap
              location={{ lat: props.location?.y, lng: props.location?.x }}
            />
          )}
      </CardContent>
    </Card>
  );
}

function AgeRangeChip(props: { startMonths: number; endMonths: number }) {
  const toYears = (months: number) => {
    if (months < 12) return `${months} mo`;
    return `${Math.floor(months / 12)} yrs`;
  };

  const range = `${toYears(props.startMonths)} - ${toYears(props.endMonths)}`;
  return (
    <div className="rounded text-xs bg-slate-200 w-fit px-2 py-1">
      {range}
    </div>
  );
}

function AvailableSpots(props: { spots: number | null }) {
  if (!props.spots) return;

  return (
    <div className="w-fit px-4 py-1 rounded-full text-xs bg-green-600 text-white font-bold">
      {props.spots} opening
    </div>
  );
}

function IsLicensed(props: { licensed: boolean }) {
  if (!props.licensed) return null;

  return (
    <Badge>
      Licensed
    </Badge>
  );
}
