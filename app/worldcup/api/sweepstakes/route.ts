import { NextResponse } from "next/server";

import { getSweepstakesData } from "@/app/worldcup/lib/tournament/data";

export async function GET() {
  // getSweepstakesData is a `use cache` function (revalidated hourly) and
  // handles its own failure path, so this handler prerenders alongside the
  // pages instead of opting into per-request dynamic rendering.
  return NextResponse.json(await getSweepstakesData());
}
