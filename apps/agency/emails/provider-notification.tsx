import {
  ProviderNotificationEmail,
  type ProviderNotificationEmailProps,
} from "../src/features/inquiries/inquiry_email_templates";

export default function ProviderNotificationPreview(
  props: ProviderNotificationEmailProps,
) {
  return <ProviderNotificationEmail {...props} />;
}

ProviderNotificationPreview.PreviewProps = {
  careType: "Full-time",
  childAge: "2 years",
  dashboardUrl: "http://localhost:3001/",
  parentEmail: "taylor@example.com",
  parentName: "Taylor Morgan",
  preferredStart: "September 1, 2026",
  tenantName: "Little Sprouts Dayhome",
} satisfies ProviderNotificationEmailProps;
