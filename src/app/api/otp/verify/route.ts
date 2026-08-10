import { NextResponse } from "next/server";
import { otpVerifySchema } from "@/lib/validations";
import { destroySession, verifyLeadOtp } from "@/lib/otp-store";
import { sendLeadEmail } from "@/lib/resend";
import { MAIL } from "@/lib/config";
import {
  leadNotificationHtml,
  leadNotificationText,
} from "@/lib/email-templates";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = otpVerifySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid OTP request" },
        { status: 400 },
      );
    }

    const result = await verifyLeadOtp(parsed.data.sessionId, parsed.data.otp);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const session = result.session;

    const { data, error } = await sendLeadEmail({
      name: session.name,
      mobile: session.mobile,
      replyTo: session.email,
      html: leadNotificationHtml(session),
      text: leadNotificationText(session),
    });

    if (error) {
      console.error("Lead forward error:", error);
      return NextResponse.json(
        {
          error:
            "Email verified, but we could not deliver your enquiry. Please try again in a moment.",
        },
        { status: 502 },
      );
    }

    console.info("Lead emailed", {
      id: data?.id,
      to: MAIL.leadsTo,
      lead: session.email,
    });

    await destroySession(session.id);

    return NextResponse.json({
      ok: true,
      message:
        "Thank you. Your enquiry is submitted. Our team will call you shortly.",
    });
  } catch (err) {
    console.error("OTP verify failed:", err);
    const message = err instanceof Error ? err.message : "Something went wrong";
    const isConfig =
      message.includes("RESEND_API_KEY") || message.includes("LEADS_TO_EMAIL");
    return NextResponse.json(
      {
        error: isConfig
          ? "Email service is not configured yet."
          : "Something went wrong. Please try again.",
      },
      { status: isConfig ? 503 : 500 },
    );
  }
}
