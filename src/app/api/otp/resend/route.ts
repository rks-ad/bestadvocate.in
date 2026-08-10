import { NextResponse } from "next/server";
import { z } from "zod";
import { refreshLeadOtp } from "@/lib/otp-store";
import { getResend } from "@/lib/resend";
import { MAIL, SITE } from "@/lib/config";
import { otpEmailHtml, otpEmailText } from "@/lib/email-templates";

export const runtime = "nodejs";

const bodySchema = z.object({
  sessionId: z.string().min(8).max(64),
});

export async function POST(request: Request) {
  try {
    const parsed = bodySchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid resend request" }, { status: 400 });
    }

    const result = await refreshLeadOtp(parsed.data.sessionId);
    if (!result.ok) {
      return NextResponse.json(
        { error: result.error, retryAfterSec: "retryAfterSec" in result ? result.retryAfterSec : undefined },
        { status: 400 },
      );
    }

    const resend = getResend();
    const { error } = await resend.emails.send({
      from: `${SITE.name} <${MAIL.otpFrom}>`,
      to: result.session.email,
      replyTo: MAIL.replyTo,
      subject: `${result.otp} is your ${SITE.name} verification code`,
      html: otpEmailHtml(result.otp, result.session.name),
      text: otpEmailText(result.otp, result.session.name),
    });

    if (error) {
      console.error("Resend OTP resend error:", error);
      return NextResponse.json(
        { error: "Unable to resend OTP. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      message: "A new OTP has been sent to your email",
    });
  } catch (err) {
    console.error("OTP resend failed:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
