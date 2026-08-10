import { Resend } from "resend";
import { MAIL, SITE } from "./config";

let client: Resend | null = null;

export function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error("RESEND_API_KEY is not configured");
  }
  if (!client) {
    client = new Resend(key);
  }
  return client;
}

export function assertMailConfig() {
  if (!MAIL.leadsTo.length) {
    throw new Error("LEADS_TO_EMAIL is empty");
  }
  if (!MAIL.otpFrom.includes("@")) {
    throw new Error("OTP_FROM_EMAIL is invalid");
  }
}

export async function sendOtpEmail(input: {
  to: string;
  name: string;
  otp: string;
  html: string;
  text: string;
}) {
  assertMailConfig();
  const resend = getResend();
  return resend.emails.send({
    from: `${SITE.name} <${MAIL.otpFrom}>`,
    to: input.to,
    replyTo: MAIL.replyTo,
    subject: `${input.otp} is your ${SITE.name} verification code`,
    html: input.html,
    text: input.text,
  });
}

export async function sendLeadEmail(input: {
  name: string;
  mobile: string;
  replyTo: string;
  html: string;
  text: string;
}) {
  assertMailConfig();
  const resend = getResend();
  const recipients = [...MAIL.leadsTo];

  const result = await resend.emails.send({
    from: `${SITE.name} <${MAIL.otpFrom}>`,
    to: recipients.length === 1 ? recipients[0] : recipients,
    replyTo: input.replyTo,
    subject: `New case enquiry from ${input.name} — ${input.mobile}`,
    html: input.html,
    text: input.text,
  });

  if (result.error) {
    // One retry with plain-text only (helps if HTML/template issues)
    console.error("Lead email first attempt failed:", result.error);
    return resend.emails.send({
      from: `${SITE.name} <${MAIL.otpFrom}>`,
      to: recipients.length === 1 ? recipients[0] : recipients,
      replyTo: input.replyTo,
      subject: `New case enquiry from ${input.name} — ${input.mobile}`,
      text: input.text,
    });
  }

  return result;
}
