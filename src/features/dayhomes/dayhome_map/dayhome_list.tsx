import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Sheet, SheetRef } from "react-modal-sheet";
import { useRef } from "react";

const snapPoints = [0, 50, 0.5, 1];

type Props = { items: CardProps[] };

export function DayhomeList({ items }: Props) {
  const ref = useRef<SheetRef>(null);

  return (
    <Sheet
      ref={ref}
      isOpen
      onClose={() => {}}
      initialSnap={1}
      dragSnapToOrigin
      snapPoints={snapPoints}
      disableDismiss
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <div className="space-y-4">
            {items?.map((item) => (
              <Link
                className="block max-w-lg mx-auto"
                to="/directory/$id"
                params={{ id: item.id }}
                key={item.name}
              >
                <DayhomeListCard
                  {...item}
                />
              </Link>
            ))}
          </div>
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  );
}

export type CardProps = {
  id: string;
  name: string;
  address: string;
  isLicensed: boolean;
  agencyName?: string | null;
  ageGroups: string[] | null;
};

function DayhomeListCard(props: CardProps) {
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
