import { Sheet, SheetRef } from "react-modal-sheet";
import { useGetDayhome } from "../get_dayhome/use_get_dayhome";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants, LinkButton } from "@/components/ui/button";
import { useEffect, useRef } from "react";

const snapPoints = [0, 40, 0.7, 1];

type Props = {
  dayhomeId: string;
};

export function DayhomeSheetPreview({ dayhomeId }: Props) {
  const { data, isPending } = useGetDayhome(dayhomeId);
  const sheetRef = useRef<SheetRef>(null);

  useEffect(() => {
    if (isPending) {
      sheetRef.current?.snapTo(1);
      return;
    }

    if (data && !isPending) {
      sheetRef.current?.snapTo(2);
    }
  }, [data, isPending]);

  return (
    <Sheet
      className="max-w-lg sm:mx-auto mx-2"
      isOpen
      ref={sheetRef}
      onClose={() => {}}
      initialSnap={2}
      dragSnapToOrigin
      snapPoints={snapPoints}
      disableDismiss
    >
      <Sheet.Container className="max-h-[60vh]">
        <Sheet.Header />
        <Sheet.Content
          disableDrag={(state) => state.scrollPosition !== "top"}
          disableScroll={(state) => state.currentSnap !== snapPoints.length - 1}
        >
          {!data ? undefined : (
            <div className="px-6">
              <div className="flex justify-between pb-4">
                <span>{data.name}</span>
                {data.isLicensed && <Badge>Licensed</Badge>}
              </div>

              <div className="flex gap-2">
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
                  <span className="text-sm text-slate-500">
                    {data.address}
                  </span>

                  <Button variant="outline" size="sm">Directions</Button>
                </div>

                {data.phone &&
                  (
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

                {data.email &&
                  (
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
