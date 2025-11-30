import { Badge } from "@/components/ui/badge";
import { buttonVariants, LinkButton } from "@/components/ui/button";
import { DayhomeTitle } from "@/features/dayhomes/dayhome_map/components/dayhome_title.tsx";
import { LicensedBadge } from "@/features/dayhomes/dayhome_map/components/licensed_badge.tsx";
import { useGetDayhome } from "@/features/dayhomes/get_dayhome/use_get_dayhome";
import { googleDirections } from "@/lib/geocoding/constant_data";
import { Route } from "@/routes/map/index.tsx";
import {
  type Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Sheet, type SheetRef } from "react-modal-sheet";

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

  const { data, isLoading, isSuccess } = useGetDayhome(dayhomeId);
  const [snapPoint, setSnapPoint] = useState(1);
  const sheetRef = useRef<SheetRef>(null);

  const expand = useCallback(async () => {
    return data ? sheetRef.current?.snapTo(maxSnap) : undefined;
  }, [data]);

  const shrink = useCallback(() => {
    return data ? sheetRef.current?.snapTo(1) : undefined;
  }, [data]);

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
    const promise = async () => {
      if (isLoading) {
        return await shrink();
      }

      if (isSuccess) {
        return await expand();
      }
    };

    promise();
  }, [data, isLoading, isSuccess, shrink, expand]);

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
      disableDrag={!data}
    >
      <Sheet.Container className="max-h-[65vh]">
        <Sheet.Header onClick={expand} />
        <Sheet.Content disableScroll={(state) => state.currentSnap !== maxSnap}>
          {!data ? undefined : (
            <div className="px-6 isolate">
              <div className="flex justify-between items-start pb-4 gap-4">
                <DayhomeTitle
                  dayhomeId={data.id}
                  name={data.name}
                  agencyName={data.agencyName}
                  type={
                    data.license?.type === "FAMILY DAY HOME"
                      ? "dayhome"
                      : "facility"
                  }
                />
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
