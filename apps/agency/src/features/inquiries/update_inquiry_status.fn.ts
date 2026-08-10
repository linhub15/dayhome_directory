import { findAgencyWorkspace } from "#/lib/auth/agency_session.fn";
import { authMiddleware } from "#/lib/auth/auth_middleware";
import {
  inquiryStatusValues,
  terminalInquiryStatuses,
} from "#/features/inquiries/inquiry_status";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const updateInquiryStatusSchema = z.object({
  inquiryId: z.uuid(),
  status: z.enum(inquiryStatusValues),
  action: z.enum(["transition", "reopen"]),
});

export const updateInquiryStatusFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => updateInquiryStatusSchema.parse(input))
  .handler(async ({ data, context }) => {
    if (!context.user) throw new Error("You must be signed in");
    const userId = context.user.id;
    const workspace = await findAgencyWorkspace(userId);
    if (!workspace) throw new Error("Complete agency onboarding first");

    const [{ getDb }, { inquiry, inquiryStatusHistory }, { and, eq }] =
      await Promise.all([
        import("#/lib/db/database"),
        import("@dayhome/db/schema"),
        import("drizzle-orm"),
      ]);

    return getDb().transaction(async (transaction) => {
      const [current] = await transaction
        .select({ status: inquiry.status })
        .from(inquiry)
        .where(
          and(
            eq(inquiry.id, data.inquiryId),
            eq(inquiry.tenantId, workspace.id),
          ),
        )
        .for("update")
        .limit(1);

      if (!current) throw new Error("Inquiry not found");
      if (current.status === data.status) return { status: current.status };

      const isReopening = terminalInquiryStatuses.has(current.status);
      if (isReopening !== (data.action === "reopen")) {
        throw new Error(
          isReopening
            ? "Use the explicit reopen action for registered or closed inquiries"
            : "Only registered or closed inquiries can be reopened",
        );
      }

      const changedAt = new Date();
      await transaction.insert(inquiryStatusHistory).values({
        inquiryId: data.inquiryId,
        fromStatus: current.status,
        toStatus: data.status,
        changedByUserId: userId,
        changedAt,
      });
      await transaction
        .update(inquiry)
        .set({ status: data.status, statusChangedAt: changedAt })
        .where(
          and(
            eq(inquiry.id, data.inquiryId),
            eq(inquiry.tenantId, workspace.id),
            eq(inquiry.status, current.status),
          ),
        );

      return { status: data.status };
    });
  });
