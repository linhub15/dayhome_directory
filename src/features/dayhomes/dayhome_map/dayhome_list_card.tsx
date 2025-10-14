import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export type Props = {
  name: string;
  address: string;
  phone: string | null;
  email: string | null;
  location: { x: number; y: number } | null;
  isLicensed: boolean;
  agencyName?: string | null;
  ageGroups: string[] | null;
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
        <div>
          {props.ageGroups?.map((ageGroup) => (
            <Badge
              className="capitalize mr-1"
              variant="secondary"
              key={ageGroup}
            >
              {ageGroup.replace("_", " ")}
            </Badge>
          ))}
        </div>
        <div className="text-slate-600 text-sm">{props.address}</div>
      </CardHeader>
      <CardContent>
      </CardContent>
    </Card>
  );
}
