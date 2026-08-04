import nodemailer from "nodemailer";
import type { ReactNode } from "react";
import { render } from "react-email";

type Message = {
  to: string;
  subject: string;
  template: ReactNode;
};

export async function sendEmail(message: Message) {
  const host = process.env.SMTP_HOST;
  const from = process.env.EMAIL_FROM;

  if (!host || !from) {
    throw new Error("SMTP_HOST and EMAIL_FROM are required to send email");
  }

  const transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASSWORD
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
          }
        : undefined,
  });

  const [html, text] = await Promise.all([
    render(message.template),
    render(message.template, { plainText: true }),
  ]);

  await transporter.sendMail({
    from,
    to: message.to,
    subject: message.subject,
    html,
    text,
  });
}
