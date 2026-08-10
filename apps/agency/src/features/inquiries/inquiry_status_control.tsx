import { Button } from "@dayhome/ui/button";
import { badgeVariants } from "@dayhome/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@dayhome/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@dayhome/ui/select";
import { useState } from "react";

import {
  inquiryStatusLabels,
  inquiryStatusValues,
  terminalInquiryStatuses,
  type InquiryStatus,
} from "./inquiry_status";
import { updateInquiryStatusFn } from "./update_inquiry_status.fn";

type InquiryStatusControlProps = {
  inquiryId: string;
  status: InquiryStatus;
  onUpdated: () => Promise<void>;
};

export function InquiryStatusControl({
  inquiryId,
  status,
  onUpdated,
}: InquiryStatusControlProps) {
  const [isPending, setIsPending] = useState(false);
  const [isReopenOpen, setIsReopenOpen] = useState(false);
  const [reopenStatus, setReopenStatus] = useState<InquiryStatus>("follow_up");
  const [error, setError] = useState<string>();

  async function updateStatus(
    nextStatus: InquiryStatus,
    action: "transition" | "reopen",
  ) {
    setIsPending(true);
    setError(undefined);
    try {
      await updateInquiryStatusFn({
        data: { inquiryId, status: nextStatus, action },
      });
      setIsReopenOpen(false);
      await onUpdated();
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Could not update status",
      );
    } finally {
      setIsPending(false);
    }
  }

  function handleStatusChange(nextStatus: InquiryStatus | null) {
    if (!nextStatus || nextStatus === status) return;

    if (terminalInquiryStatuses.has(status)) {
      setReopenStatus(nextStatus);
      setIsReopenOpen(true);
      return;
    }

    void updateStatus(nextStatus, "transition");
  }

  return (
    <>
      <div className="grid gap-1">
        <Select
          value={status}
          disabled={isPending}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger
            size="sm"
            aria-label="Change inquiry status"
            className={badgeVariants({
              variant: "secondary",
              size: "base",
              className:
                "cursor-pointer shadow-none data-[size=sm]:h-auto [&_svg]:size-3",
            })}
          >
            <SelectValue>
              {(value) => inquiryStatusLabels[value as InquiryStatus]}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {inquiryStatusValues.map((value) => (
              <SelectItem
                key={value}
                value={value}
                disabled={
                  terminalInquiryStatuses.has(status) &&
                  terminalInquiryStatuses.has(value) &&
                  value !== status
                }
              >
                {inquiryStatusLabels[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error ? (
          <span className="text-xs text-destructive">{error}</span>
        ) : null}
      </div>

      <Dialog open={isReopenOpen} onOpenChange={setIsReopenOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reopen inquiry</DialogTitle>
            <DialogDescription>
              This inquiry is {inquiryStatusLabels[status].toLowerCase()}.
              Choose the active status it should return to.
            </DialogDescription>
          </DialogHeader>
          <Select
            value={reopenStatus}
            onValueChange={(value) => value && setReopenStatus(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue>
                {(value) => inquiryStatusLabels[value as InquiryStatus]}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {inquiryStatusValues
                .filter((value) => !terminalInquiryStatuses.has(value))
                .map((value) => (
                  <SelectItem key={value} value={value}>
                    {inquiryStatusLabels[value]}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {error ? (
            <p className="m-0 text-sm text-destructive">{error}</p>
          ) : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReopenOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={isPending}
              onClick={() => void updateStatus(reopenStatus, "reopen")}
            >
              {isPending ? "Reopening…" : "Reopen inquiry"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
