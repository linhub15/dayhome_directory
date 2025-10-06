import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PinnedMap } from "@/components/ui/pinned_map";

type Props = {
  name: string;
  address: string;
  phone: string | null;
  email: string | null;
  location: { x: number; y: number } | null;
  isLicensed: boolean;
  agencyName?: string | null;
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
          <div>
            <div>{props.name}</div>
            <div className="text-xs text-slate-700 font-medium italic">
              {props.agencyName}
            </div>
          </div>
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
        <div className="text-slate-600">{props.email}</div>
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
