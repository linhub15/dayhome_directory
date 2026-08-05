import type { InquiryWithChildren } from "@dayhome/db/schema";
import { sendEmail } from "#/lib/email/mailer.server";

import {
  careTypeLabels,
  formatChildAge,
  formatExpectedStart,
} from "./inquiry_schema";
import {
  ParentConfirmationEmail,
  ProviderNotificationEmail,
} from "./inquiry_email_templates";

type InquiryEmailContext = {
  inquiry: InquiryWithChildren;
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
      children: inquiry.children.map((child) => ({
        careType: careTypeLabels[child.careType],
        childAge: formatChildAge(child.birthDate),
        expectedStart: formatExpectedStart(
          child.expectedStart,
          child.expectedStartDate,
        ),
      })),
      parentFirstName: inquiry.parentFirstName,
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
      children: inquiry.children.map((child) => ({
        careType: careTypeLabels[child.careType],
        childAge: formatChildAge(child.birthDate),
        expectedStart: formatExpectedStart(
          child.expectedStart,
          child.expectedStartDate,
        ),
      })),
      dashboardUrl,
      parentEmail: inquiry.parentEmail,
      parentName: `${inquiry.parentFirstName} ${inquiry.parentLastName}`,
      tenantName: tenant.name,
    }),
  });
}
