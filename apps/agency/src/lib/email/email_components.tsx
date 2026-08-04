import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
  pixelBasedPreset,
} from "react-email";
import type { ReactNode } from "react";

type EmailLayoutProps = {
  children: ReactNode;
  preview: string;
  tenantName: string;
};

export function EmailLayout({
  children,
  preview,
  tenantName,
}: EmailLayoutProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Tailwind config={{ presets: [pixelBasedPreset] }}>
        <Body className="m-0 bg-[#f1f5f2] px-4 py-8 font-sans text-[#263a33]">
          <Container className="mx-auto max-w-150 overflow-hidden rounded-2xl border border-solid border-[#dce7e0] bg-white">
            <Section className="bg-[#275f50] px-8 py-7">
              <Text className="m-0 text-xs font-bold uppercase tracking-[0.16em] text-[#cce8d9]">
                Childcare inquiry
              </Text>
              <Text className="m-0 mt-2 text-xl font-bold text-white">
                {tenantName}
              </Text>
            </Section>

            <Section className="px-8 py-8">{children}</Section>

            <Section className="px-8 pb-8">
              <Hr className="m-0 border-[#e2e9e5]" />
              <Text className="mb-0 mt-5 text-xs leading-5 text-[#74847d]">
                This email was sent because a childcare inquiry was submitted to{" "}
                {tenantName}.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

type EmailHeadingProps = {
  children: ReactNode;
};

export function EmailHeading({ children }: EmailHeadingProps) {
  return (
    <Heading className="m-0 text-2xl font-bold leading-8 tracking-[-0.02em] text-[#1f342d]">
      {children}
    </Heading>
  );
}

type Detail = {
  label: string;
  value: string;
};

export function InquiryDetails({ details }: { details: Detail[] }) {
  return (
    <Section className="mt-6 rounded-xl border border-solid border-[#dce7e0] bg-[#f8faf8] px-5 py-2">
      {details.map((detail, index) => (
        <Section
          className={
            index === details.length - 1
              ? "py-3"
              : "border-0 border-b border-solid border-[#e2e9e5] py-3"
          }
          key={detail.label}
        >
          <Text className="m-0 text-xs font-bold uppercase tracking-[0.08em] text-[#77877f]">
            {detail.label}
          </Text>
          <Text className="m-0 mt-1 text-sm font-semibold leading-6 text-[#263a33]">
            {detail.value}
          </Text>
        </Section>
      ))}
    </Section>
  );
}
