import { NextResponse } from "next/server";
import { otpVerifySchema } from "@/lib/validations";
import {
  destroySession,
  readAttachmentBuffers,
  verifyLeadOtp,
} from "@/lib/otp-store";
import { getResend } from "@/lib/resend";
import { MAIL, SITE } from "@/lib/config";
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
    const attachments = await readAttachmentBuffers(session);
    const resend = getResend();

    const { error } = await resend.emails.send({
      from: `${SITE.name} Leads <${MAIL.otpFrom}>`,
      to: MAIL.leadsTo,
      replyTo: session.email,
      subject: `New case enquiry from ${session.name} — ${session.mobile}`,
      html: leadNotificationHtml(session),
      text: leadNotificationText(session),
      attachments: attachments.map((file) => ({
        filename: file.filename,
        content: file.content,
        contentType: file.contentType,
      })),
    });

    if (error) {
      console.error("Lead forward error:", error);
      return NextResponse.json(
        {
          error:
            "Email verified, but we could not deliver your enquiry. Please call us or try again.",
        },
        { status: 502 },
      );
    }

    await destroySession(session.id);

    return NextResponse.json({
      ok: true,
      message:
        "Thank you. Your enquiry is submitted. Our team will call you shortly.",
    });
  } catch (err) {
    console.error("OTP verify failed:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
