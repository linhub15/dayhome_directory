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
  children: [
    {
      careType: "Full-time",
      childAge: "2 years",
      expectedStart: "September 1, 2026",
    },
  ],
  parentFirstName: "Taylor",
  tenantName: "Little Sprouts Dayhome",
} satisfies ParentConfirmationEmailProps;
