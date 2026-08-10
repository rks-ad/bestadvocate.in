import { NextResponse } from "next/server";
import { MAIL } from "@/lib/config";

export const runtime = "nodejs";

export async function GET() {
  const hasKey = Boolean(process.env.RESEND_API_KEY);
  return NextResponse.json({
    ok: true,
    service: "bestadvocate.in",
    email: {
      configured: hasKey,
      otpFrom: MAIL.otpFrom,
      leadsTo: MAIL.leadsTo,
      replyTo: MAIL.replyTo,
    },
  });
}
