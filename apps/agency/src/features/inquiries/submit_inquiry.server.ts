import { getDb } from "#/lib/db/database";
import {
  inquiry,
  inquiryChild,
  inquiryStatusHistory,
  tenant,
  tenantProfile,
} from "@dayhome/db/schema";
import { and, eq } from "drizzle-orm";

import {
  sendParentConfirmation,
  sendProviderNotification,
} from "./inquiry_emails.server";
import type { InquirySubmission } from "./inquiry_schema";

export type SubmitInquiryResult =
  | { status: "created"; inquiryId: string }
  | { status: "tenant_not_found" };

export async function submitInquiry(
  tenantSlug: string,
  submission: InquirySubmission,
): Promise<SubmitInquiryResult> {
  const db = getDb();
  const [tenantContext] = await db
    .select({
      id: tenant.id,
      name: tenantProfile.name,
      notificationEmail: tenantProfile.notificationEmail,
    })
    .from(tenant)
    .innerJoin(tenantProfile, eq(tenantProfile.tenantId, tenant.id))
    .where(
      and(
        eq(tenant.slug, tenantSlug),
        eq(tenantProfile.isInquiryFormEnabled, true),
      ),
    )
    .limit(1);

  if (!tenantContext) return { status: "tenant_not_found" };

  const createdInquiry = await db.transaction(async (transaction) => {
    const [record] = await transaction
      .insert(inquiry)
      .values({
        tenantId: tenantContext.id,
        parentFirstName: submission.parentFirstName,
        parentLastName: submission.parentLastName,
        parentEmail: submission.parentEmail,
      })
      .returning();

    if (!record) throw new Error("Inquiry insert returned no record");

    await transaction.insert(inquiryStatusHistory).values({
      inquiryId: record.id,
      toStatus: "new",
      changedAt: record.statusChangedAt,
    });

    const children = await transaction
      .insert(inquiryChild)
      .values(
        submission.children.map((child) => ({
          inquiryId: record.id,
          careType: child.careType,
          birthDate: child.birthDate,
          expectedStart: child.expectedStart,
          expectedStartDate:
            child.expectedStart === "specific_date"
              ? child.expectedStartDate || null
              : null,
        })),
      )
      .returning();

    return { ...record, children };
  });

  const deliveries = await Promise.allSettled([
    sendParentConfirmation({ inquiry: createdInquiry, tenant: tenantContext }),
    sendProviderNotification({
      inquiry: createdInquiry,
      tenant: tenantContext,
    }),
  ]);

  const [parentDelivery, providerDelivery] = deliveries;

  if (parentDelivery?.status === "fulfilled") {
    await markEmailSent(createdInquiry.id, tenantContext.id, "parent").catch(
      (reason: unknown) => {
        console.error("Failed to record parent confirmation delivery", {
          inquiryId: createdInquiry.id,
          reason,
        });
      },
    );
  } else {
    console.error("Parent inquiry confirmation failed", {
      inquiryId: createdInquiry.id,
      reason: parentDelivery?.reason,
    });
  }

  if (providerDelivery?.status === "fulfilled") {
    await markEmailSent(createdInquiry.id, tenantContext.id, "provider").catch(
      (reason: unknown) => {
        console.error("Failed to record provider notification delivery", {
          inquiryId: createdInquiry.id,
          reason,
        });
      },
    );
  } else {
    console.error("Provider inquiry notification failed", {
      inquiryId: createdInquiry.id,
      reason: providerDelivery?.reason,
    });
  }

  return { status: "created", inquiryId: createdInquiry.id };
}

async function markEmailSent(
  inquiryId: string,
  tenantId: string,
  recipient: "parent" | "provider",
) {
  const db = getDb();
  await db
    .update(inquiry)
    .set(
      recipient === "parent"
        ? { parentConfirmationSentAt: new Date() }
        : { providerNotificationSentAt: new Date() },
    )
    .where(and(eq(inquiry.id, inquiryId), eq(inquiry.tenantId, tenantId)));
}
