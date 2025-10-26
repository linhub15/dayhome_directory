import { CircleCheckIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Sheet, type SheetRef } from "react-modal-sheet";
import { Badge } from "@/components/ui/badge";
import { buttonVariants, LinkButton } from "@/components/ui/button";
import { useGetDayhome } from "@/features/dayhomes/get_dayhome/use_get_dayhome";
import { googleDirections } from "@/lib/geocoding/constant_data";

const snapPoints = [0, 40, 0.7, 1];
const maxSnap = snapPoints.length - 1;

type Props = {
  isDismissed: boolean;
  dayhomeId: string;
};

export function DayhomeSheetPreview({ isDismissed, dayhomeId }: Props) {
  const { data, isPending } = useGetDayhome(dayhomeId);
  const [snapPoint, setSnapPoint] = useState(2);
  const sheetRef = useRef<SheetRef>(null);

  const shrink = useCallback(() => {
    sheetRef.current?.snapTo(1);
  }, []);

  const expand = useCallback(() => {
    sheetRef.current?.snapTo(2);
  }, []);

  useEffect(() => {
    if (isPending || isDismissed) {
      return shrink();
    }

    if (data && !isPending) {
      return expand();
    }
  }, [data, isPending, isDismissed, shrink, expand]);

  return (
    <Sheet
      className="max-w-lg sm:mx-auto mx-2"
      isOpen
      ref={sheetRef}
      onClose={() => {}}
      initialSnap={snapPoint}
      dragSnapToOrigin
      snapPoints={snapPoints}
      onSnap={(snap) => setSnapPoint(snap)}
      disableDismiss
    >
      <Sheet.Container className="max-h-[60vh]">
        <Sheet.Header onClick={expand} />
        <Sheet.Content disableScroll={(state) => state.currentSnap !== maxSnap}>
          {!data ? undefined : (
            <div className="px-6">
              <div className="flex justify-between items-start pb-4">
                <span>{data.name}</span>
                {data.isLicensed && (
                  <Badge>
                    <CircleCheckIcon />
                    Licensed
                  </Badge>
                )}
              </div>

              <div className="flex gap-2 flex-wrap">
                {data.ageGroups?.map((ageGroup) => (
                  <Badge
                    className="capitalize"
                    variant="secondary"
                    key={ageGroup}
                  >
                    {ageGroup.replace("_", " ")}
                  </Badge>
                ))}
              </div>

              <div className="divide-y">
                <div className="flex items-center justify-between py-4">
                  <span className="text-sm text-slate-500">{data.address}</span>

                  <a
                    className={buttonVariants({
                      variant: "outline",
                      size: "sm",
                    })}
                    href={googleDirections(data.address)}
                  >
                    Directions
                  </a>
                </div>

                {data.phone && (
                  <div className="flex items-center justify-between py-4">
                    <span>{data.phone}</span>

                    <a
                      className={buttonVariants({
                        variant: "outline",
                        size: "sm",
                      })}
                      href={`tel:${data.phone}`}
                    >
                      Call
                    </a>
                  </div>
                )}

                {data.email && (
                  <div className="flex items-center justify-between py-4">
                    <span>{data.email}</span>

                    <a
                      className={buttonVariants({
                        variant: "outline",
                        size: "sm",
                      })}
                      href={`mailto:${data.email}`}
                    >
                      Email
                    </a>
                  </div>
                )}
              </div>

              <div className="py-6">
                <LinkButton
                  className="w-full"
                  to="/directory/$id"
                  params={{ id: dayhomeId }}
                >
                  More Details
                </LinkButton>
              </div>
            </div>
          )}
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  );
}
