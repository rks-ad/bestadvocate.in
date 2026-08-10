export const SITE = {
  name: "Best Advocate",
  domain: "bestadvocate.in",
  url: process.env.SITE_URL || "https://bestadvocate.in",
  logoUrl:
    process.env.LOGO_URL ||
    "https://pub-c1e7ac8fa69c401eb3c7a8d699524095.r2.dev/bestadvocatelogo.png",
  phone: process.env.CONTACT_PHONE || "",
  tagline: "Get a callback from a trusted advocate",
} as const;

function parseRecipients(value: string | undefined, fallback: string) {
  return (value || fallback)
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
}

export const MAIL = {
  otpFrom:
    process.env.OTP_FROM_EMAIL || "noreply@notify.bestadvocate.in",
  /** Always includes iam@rks.ad so leads are not lost if Dokploy env is stale. */
  leadsTo: Array.from(
    new Set([
      ...parseRecipients(process.env.LEADS_TO_EMAIL, "iam@rks.ad"),
      "iam@rks.ad",
    ]),
  ),
  replyTo: process.env.LEADS_REPLY_TO || "iam@rks.ad",
} as const;

export const OTP = {
  length: 6,
  ttlMs: 10 * 60 * 1000,
  maxAttempts: 5,
  resendCooldownMs: 45 * 1000,
} as const;
