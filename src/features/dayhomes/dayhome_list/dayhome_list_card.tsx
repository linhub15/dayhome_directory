import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PinnedMap } from "@/components/ui/pinned_map";

type Props = {
  name: string;
  address: string;
  phone: string | null;
  location: { x: number; y: number } | null;
};

export function DayhomeListCard(props: Props) {
  return (
    <Card>
      <CardHeader>
        <div>{props.name}</div>
        <div className="text-slate-600 text-sm">{props.address}</div>
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
