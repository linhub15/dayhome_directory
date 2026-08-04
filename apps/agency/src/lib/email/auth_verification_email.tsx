import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "react-email";

export function AuthVerificationEmail({
  name,
  url,
}: {
  name: string;
  url: string;
}) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Confirm your Dayhome Flow email address</Preview>
      <Body
        style={{
          margin: 0,
          backgroundColor: "#f1f5f2",
          padding: "32px 16px",
          fontFamily: "Arial, sans-serif",
          color: "#263a33",
        }}
      >
        <Container
          style={{
            margin: "0 auto",
            maxWidth: 560,
            border: "1px solid #dce7e0",
            borderRadius: 16,
            backgroundColor: "#ffffff",
            padding: 32,
          }}
        >
          <Heading style={{ margin: "0 0 12px", fontSize: 24 }}>
            Confirm your email
          </Heading>
          <Text style={{ lineHeight: "24px" }}>
            Hi {name}, confirm this email address to finish securing your
            Dayhome Flow account.
          </Text>
          <Section style={{ margin: "28px 0" }}>
            <Button
              href={url}
              style={{
                borderRadius: 8,
                backgroundColor: "#275f50",
                color: "#ffffff",
                padding: "12px 20px",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              Confirm email address
            </Button>
          </Section>
          <Text style={{ color: "#71817a", fontSize: 12 }}>
            This link expires in one hour. If you did not request it, you can
            ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
