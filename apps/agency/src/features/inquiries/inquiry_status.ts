import { inquiryStatusValues, type InquiryStatus } from "@dayhome/db/schema";

export { inquiryStatusValues };
export type { InquiryStatus };

export const inquiryStatusLabels: Record<InquiryStatus, string> = {
  new: "New",
  contacted: "Contacted",
  follow_up: "Follow-up",
  registered: "Registered",
  closed: "Closed",
};

export const terminalInquiryStatuses = new Set<InquiryStatus>([
  "registered",
  "closed",
]);
