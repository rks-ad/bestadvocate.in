import { NextResponse } from "next/server";
import { getSiteStats } from "@/lib/stats-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const stats = await getSiteStats({ tick: true });
    return NextResponse.json({
      ok: true,
      liveViewers: stats.liveViewers,
      totalHits: stats.totalHits,
      nextTickMs: stats.nextTickMs,
    });
  } catch (err) {
    console.error("Stats API failed:", err);
    return NextResponse.json(
      { error: "Unable to load stats" },
      { status: 500 },
    );
  }
}
