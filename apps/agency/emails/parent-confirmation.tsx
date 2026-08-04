import {
  ParentConfirmationEmail,
  type ParentConfirmationEmailProps,
} from "../src/features/inquiries/inquiry_email_templates";

export default function ParentConfirmationPreview(
  props: ParentConfirmationEmailProps,
) {
  return <ParentConfirmationEmail {...props} />;
}

ParentConfirmationPreview.PreviewProps = {
  careType: "Full-time",
  childAge: "2 years",
  parentFirstName: "Taylor",
  preferredStart: "September 1, 2026",
  tenantName: "Little Sprouts Dayhome",
} satisfies ParentConfirmationEmailProps;
