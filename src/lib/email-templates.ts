import { SITE } from "./config";
import type { LeadSession } from "./otp-store";

const brand = {
  ink: "#0A1628",
  navy: "#12263F",
  brass: "#B8975A",
  cream: "#F7F3EA",
  muted: "#5C6B7A",
  white: "#FFFFFF",
};

function shell(title: string, body: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#E8EEF4;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#E8EEF4;padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:${brand.white};border-radius:16px;overflow:hidden;box-shadow:0 12px 40px rgba(10,22,40,0.12);">
          <tr>
            <td style="background:linear-gradient(135deg,${brand.ink} 0%,${brand.navy} 100%);padding:28px 32px;text-align:center;">
              <img src="${SITE.logoUrl}" alt="${SITE.name}" width="72" height="72" style="display:block;margin:0 auto 14px;border-radius:12px;background:${brand.white};object-fit:contain;" />
              <div style="font-family:Georgia,serif;font-size:28px;letter-spacing:0.04em;color:${brand.white};font-weight:700;">${SITE.name}</div>
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:${brand.brass};margin-top:8px;">Legal Support · India</div>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              ${body}
            </td>
          </tr>
          <tr>
            <td style="padding:18px 32px 28px;border-top:1px solid #E6ECF2;text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:${brand.muted};line-height:1.6;">
              This message was sent by ${SITE.name} (${SITE.domain}).<br />
              If you did not request this, you can safely ignore this email.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function otpEmailHtml(otp: string, name: string) {
  const body = `
    <p style="margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:${brand.navy};">Dear ${escapeHtml(name)},</p>
    <p style="margin:0 0 22px;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:${brand.muted};line-height:1.6;">
      Use the one-time password below to verify your email and submit your case enquiry to ${SITE.name}.
    </p>
    <div style="text-align:center;margin:8px 0 24px;">
      <div style="display:inline-block;background:${brand.cream};border:1px solid #E5D9C3;border-radius:12px;padding:18px 28px;">
        <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:${brand.brass};margin-bottom:8px;">Your OTP</div>
        <div style="font-family:Georgia,serif;font-size:36px;letter-spacing:0.28em;color:${brand.ink};font-weight:700;">${otp}</div>
      </div>
    </div>
    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${brand.muted};line-height:1.6;">
      This code expires in <strong style="color:${brand.navy};">10 minutes</strong>. Our team will contact you after your enquiry is verified.
    </p>
  `;
  return shell("Verify your email — Best Advocate", body);
}

export function otpEmailText(otp: string, name: string) {
  return `Dear ${name},

Your Best Advocate verification OTP is: ${otp}

This code expires in 10 minutes. If you did not request this, ignore this email.

— ${SITE.name} (${SITE.domain})`;
}

export function leadNotificationHtml(session: LeadSession) {
  const rows = [
    ["Name", session.name],
    ["Mobile", session.mobile],
    ["Email", session.email],
    ["Attachments", String(session.attachments.length)],
    ["Submitted", new Date(session.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })],
  ]
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #EEF2F6;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${brand.muted};width:120px;vertical-align:top;">${label}</td>
        <td style="padding:10px 0;border-bottom:1px solid #EEF2F6;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:${brand.ink};font-weight:600;">${escapeHtml(value)}</td>
      </tr>`,
    )
    .join("");

  const body = `
    <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:${brand.brass};">New lead</p>
    <h1 style="margin:0 0 18px;font-family:Georgia,serif;font-size:26px;color:${brand.ink};font-weight:700;">Case enquiry received</h1>
    <p style="margin:0 0 22px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:${brand.muted};line-height:1.6;">
      A verified enquiry was submitted on ${SITE.domain}. Please call the client promptly.
    </p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:22px;">
      ${rows}
    </table>
    <div style="background:${brand.cream};border-radius:12px;padding:18px 20px;">
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:${brand.brass};margin-bottom:10px;">Case description</div>
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:${brand.navy};line-height:1.7;white-space:pre-wrap;">${escapeHtml(session.caseDescription)}</div>
    </div>
  `;
  return shell("New case enquiry — Best Advocate", body);
}

export function leadNotificationText(session: LeadSession) {
  return `New verified case enquiry — ${SITE.name}

Name: ${session.name}
Mobile: ${session.mobile}
Email: ${session.email}
Submitted: ${new Date(session.createdAt).toISOString()}
Attachments: ${session.attachments.length}

Case description:
${session.caseDescription}
`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
