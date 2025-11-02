import {
  type Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Sheet, type SheetRef } from "react-modal-sheet";
import { Badge } from "@/components/ui/badge";
import { buttonVariants, LinkButton } from "@/components/ui/button";
import { DayhomeTitle } from "@/features/dayhomes/dayhome_map/components/dayhome_title.tsx";
import { LicensedBadge } from "@/features/dayhomes/dayhome_map/components/licensed_badge.tsx";
import { useGetDayhome } from "@/features/dayhomes/get_dayhome/use_get_dayhome";
import { googleDirections } from "@/lib/geocoding/constant_data";
import { Route } from "@/routes/map/index.tsx";

const snapPoints = [0, 40, 1];
const maxSnap = snapPoints.length - 1;

type Props = {
  ref: Ref<{ open: () => void; close: () => void }>;
};

export function DayhomeSheetPreview({ ref }: Props) {
  const dayhomeId = Route.useSearch({
    select: ({ f }) => f,
    structuralSharing: true,
  });

  const { data, isPending } = useGetDayhome(dayhomeId);
  const [snapPoint, setSnapPoint] = useState(1);
  const sheetRef = useRef<SheetRef>(null);

  const expand = useCallback(() => {
    sheetRef.current?.snapTo(maxSnap);
  }, []);

  const shrink = useCallback(() => {
    sheetRef.current?.snapTo(1);
  }, []);

  useImperativeHandle(ref, () => {
    return {
      open: () => {
        expand();
      },
      close: () => {
        shrink();
      },
    };
  }, [shrink, expand]);

  useEffect(() => {
    if (isPending) {
      return shrink();
    }

    if (data && !isPending) {
      return expand();
    }
  }, [data, isPending, shrink, expand]);

  if (!dayhomeId) {
    return;
  }

  return (
    <Sheet
      ref={sheetRef}
      className="max-w-lg sm:mx-auto"
      style={{ zIndex: "auto" }}
      isOpen
      onClose={() => {}}
      initialSnap={snapPoint}
      dragSnapToOrigin
      snapPoints={snapPoints}
      onSnap={(snap) => setSnapPoint(snap)}
      disableDismiss
    >
      <Sheet.Container className="max-h-[65vh]">
        <Sheet.Header onClick={expand} />
        <Sheet.Content disableScroll={(state) => state.currentSnap !== maxSnap}>
          {!data ? undefined : (
            <div className="px-6 isolate">
              <div className="flex justify-between items-start pb-4 gap-4">
                <DayhomeTitle name={data.name} agencyName={data.agencyName} />
                <LicensedBadge isLicensed={data.isLicensed} />
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
                    <span className="overflow-auto mr-1">{data.email}</span>

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
