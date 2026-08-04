import { z } from "zod";

export const inquiryStageValues = [
  "new",
  "contacted",
  "tour_scheduled",
  "placement_offered",
  "placed",
  "closed",
] as const;

export const InquiryStageSchema = z.enum(inquiryStageValues);
export type InquiryStage = z.infer<typeof InquiryStageSchema>;

export const InquirySchema = z.object({
  initials: z.string().trim().min(1).max(4),
  family: z.string().trim().min(1),
  child: z.string().trim().min(1),
  area: z.string().trim().min(1),
  need: z.string().trim().min(1),
  source: z.string().trim().min(1),
  tone: z.enum(["teal", "gold", "lavender", "coral", "blue"]),
});

export type Inquiry = z.infer<typeof InquirySchema>;
