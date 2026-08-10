import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/validations";
import { createLeadSession } from "@/lib/otp-store";
import { getResend } from "@/lib/resend";
import { MAIL, SITE } from "@/lib/config";
import { otpEmailHtml, otpEmailText } from "@/lib/email-templates";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const form = await request.formData();

    const parsed = leadSchema.safeParse({
      name: form.get("name"),
      mobile: form.get("mobile"),
      email: form.get("email"),
      caseDescription: form.get("caseDescription"),
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid form data" },
        { status: 400 },
      );
    }

    const { sessionId, otp } = await createLeadSession(parsed.data);

    const resend = getResend();
    const { error } = await resend.emails.send({
      from: `${SITE.name} <${MAIL.otpFrom}>`,
      to: parsed.data.email,
      replyTo: MAIL.replyTo,
      subject: `${otp} is your ${SITE.name} verification code`,
      html: otpEmailHtml(otp, parsed.data.name),
      text: otpEmailText(otp, parsed.data.name),
    });

    if (error) {
      console.error("Resend OTP error:", error);
      return NextResponse.json(
        { error: "Unable to send verification email. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      sessionId,
      message: "OTP sent to your email address",
      emailHint: maskEmail(parsed.data.email),
    });
  } catch (err) {
    console.error("OTP send failed:", err);
    const message =
      err instanceof Error ? err.message : "Something went wrong. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function maskEmail(email: string) {
  const [user, domain] = email.split("@");
  if (!user || !domain) return email;
  const visible = user.slice(0, Math.min(2, user.length));
  return `${visible}${"*".repeat(Math.max(user.length - 2, 1))}@${domain}`;
}
