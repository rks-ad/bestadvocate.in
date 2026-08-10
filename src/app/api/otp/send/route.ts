import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/validations";
import { createLeadSession } from "@/lib/otp-store";
import { sendOtpEmail } from "@/lib/resend";
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

    const { data, error } = await sendOtpEmail({
      to: parsed.data.email,
      name: parsed.data.name,
      otp,
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

    console.info("OTP emailed", { id: data?.id, to: parsed.data.email });

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
    const isConfig =
      typeof message === "string" &&
      (message.includes("RESEND_API_KEY") || message.includes("LEADS_TO_EMAIL"));
    return NextResponse.json(
      { error: isConfig ? "Email service is not configured yet." : message },
      { status: isConfig ? 503 : 500 },
    );
  }
}

function maskEmail(email: string) {
  const [user, domain] = email.split("@");
  if (!user || !domain) return email;
  const visible = user.slice(0, Math.min(2, user.length));
  return `${visible}${"*".repeat(Math.max(user.length - 2, 1))}@${domain}`;
}
