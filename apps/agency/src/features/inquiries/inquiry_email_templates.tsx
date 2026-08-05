import { Button, Text } from "react-email";

import {
  EmailHeading,
  EmailLayout,
  InquiryDetails,
} from "#/lib/email/email_components";

type ChildDetails = {
  careType: string;
  childAge: string;
  expectedStart: string;
};

export type ParentConfirmationEmailProps = {
  children: ChildDetails[];
  parentFirstName: string;
  tenantName: string;
};

export function ParentConfirmationEmail({
  children,
  parentFirstName,
  tenantName,
}: ParentConfirmationEmailProps) {
  return (
    <EmailLayout
      preview={`${tenantName} received your childcare inquiry.`}
      tenantName={tenantName}
    >
      <EmailHeading>Thanks, {parentFirstName}.</EmailHeading>
      <Text className="mb-0 mt-4 text-base leading-7 text-[#53665e]">
        {tenantName} has received your childcare inquiry. The provider will
        review your request and contact you about next steps.
      </Text>
      <InquiryDetails
        details={children.flatMap((child, index) => [
          {
            label: children.length > 1 ? `Child ${index + 1}` : "Child",
            value: `${child.childAge} · ${child.careType}`,
          },
          { label: "Expected start", value: child.expectedStart },
        ])}
      />
      <Text className="mb-0 mt-6 rounded-lg bg-[#eef6f1] px-4 py-3 text-sm leading-6 text-[#456158]">
        You can reply directly to the provider when they get in touch.
      </Text>
    </EmailLayout>
  );
}

export type ProviderNotificationEmailProps = {
  children: ChildDetails[];
  dashboardUrl: string;
  parentEmail: string;
  parentName: string;
  tenantName: string;
};

export function ProviderNotificationEmail({
  children,
  dashboardUrl,
  parentEmail,
  parentName,
  tenantName,
}: ProviderNotificationEmailProps) {
  return (
    <EmailLayout
      preview={`New childcare inquiry from ${parentName}.`}
      tenantName={tenantName}
    >
      <EmailHeading>A new inquiry is ready to review.</EmailHeading>
      <Text className="mb-0 mt-4 text-base leading-7 text-[#53665e]">
        {parentName} is interested in childcare with {tenantName}.
      </Text>
      <InquiryDetails
        details={[
          { label: "Parent", value: parentName },
          { label: "Email", value: parentEmail },
          ...children.flatMap((child, index) => [
            {
              label: children.length > 1 ? `Child ${index + 1}` : "Child",
              value: `${child.childAge} · ${child.careType}`,
            },
            { label: "Expected start", value: child.expectedStart },
          ]),
        ]}
      />
      <Button
        className="mt-6 rounded-lg bg-[#275f50] px-5 py-3 text-sm font-bold text-white"
        href={dashboardUrl}
      >
        Review inquiry dashboard
      </Button>
      <Text className="mb-0 mt-4 text-xs leading-5 text-[#77877f]">
        Or copy this address into your browser: {dashboardUrl}
      </Text>
    </EmailLayout>
  );
}
