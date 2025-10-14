import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { Sheet, SheetRef } from "react-modal-sheet";
import { useRef } from "react";

const snapPoints = [0, 70, 0.5, 1];

type Props = { items: CardProps[] };

export function DayhomeList({ items }: Props) {
  const ref = useRef<SheetRef>(null);

  return (
    <Sheet
      className="max-w-2xl sm:mx-auto mx-2"
      isOpen
      ref={ref}
      onClose={() => {}}
      initialSnap={1}
      dragSnapToOrigin
      snapPoints={snapPoints}
      disableDismiss
    >
      <Sheet.Container className="max-h-[60vh]">
        <Sheet.Header />
        <Sheet.Content
          disableDrag={(state) => state.scrollPosition !== "top"}
        >
          <div className="space-y-7">
            {items?.map((item) => (
              <Link
                className="block max-w-lg sm:mx-auto px-2"
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
    </Card>
  );
}
