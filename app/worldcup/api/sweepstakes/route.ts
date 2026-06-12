import { NextResponse } from "next/server";
import { getParticipantsFile } from "@/app/worldcup/lib/participants";
import { buildSweepstakesResponse } from "@/app/worldcup/lib/tournament/sweepstakes";
import { getPollerState } from "@/app/worldcup/lib/tournament/poller";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const poller = await getPollerState();
    const participantsFile = getParticipantsFile([
      ...poller.teamsByFifa.values(),
    ]);
    return NextResponse.json(buildSweepstakesResponse(participantsFile, poller));
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
