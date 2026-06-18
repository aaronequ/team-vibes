import { NextResponse } from "next/server";

import { getSweepstakesData } from "@/app/worldcup/lib/tournament/data";

export async function GET() {
  try {
    return NextResponse.json(await getSweepstakesData());
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 503 },
    );
  }
}
