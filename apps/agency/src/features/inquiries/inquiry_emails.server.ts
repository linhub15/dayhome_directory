import type { InquiryRecord } from "@dayhome/db/schema";
import { sendEmail } from "#/lib/email/mailer.server";

import { careTypeLabels, formatChildAge } from "./inquiry_schema";
import {
  ParentConfirmationEmail,
  ProviderNotificationEmail,
} from "./inquiry_email_templates";

type InquiryEmailContext = {
  inquiry: InquiryRecord;
  tenant: {
    name: string;
    notificationEmail: string;
  };
};

export async function sendParentConfirmation({
  inquiry,
  tenant,
}: InquiryEmailContext) {
  await sendEmail({
    to: inquiry.parentEmail,
    subject: `We received your childcare inquiry — ${tenant.name}`,
    template: ParentConfirmationEmail({
      careType: careTypeLabels[inquiry.careType],
      childAge: formatChildAge(inquiry.childBirthDate),
      parentFirstName: inquiry.parentFirstName,
      preferredStart: formatDate(inquiry.preferredStartDate),
      tenantName: tenant.name,
    }),
  });
}

export async function sendProviderNotification({
  inquiry,
  tenant,
}: InquiryEmailContext) {
  const dashboardUrl = new URL(
    "/",
    process.env.AGENCY_APP_URL ?? "http://localhost:3001",
  ).href;

  await sendEmail({
    to: tenant.notificationEmail,
    subject: `New childcare inquiry from ${inquiry.parentFirstName} ${inquiry.parentLastName}`,
    template: ProviderNotificationEmail({
      careType: careTypeLabels[inquiry.careType],
      childAge: formatChildAge(inquiry.childBirthDate),
      dashboardUrl,
      parentEmail: inquiry.parentEmail,
      parentName: `${inquiry.parentFirstName} ${inquiry.parentLastName}`,
      preferredStart: formatDate(inquiry.preferredStartDate),
      tenantName: tenant.name,
    }),
  });
}

function formatDate(date: string | null) {
  if (!date) return "Not specified";
  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}
