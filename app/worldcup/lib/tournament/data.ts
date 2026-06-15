import { cacheLife } from "next/cache";

import { getParticipantsFile } from "../participants";
import type { PollerState, SweepstakesResponse } from "../types";
import { fetchTournamentSnapshot, getMockTournamentSnapshot } from "./client";
import { tournamentConfig } from "./config";
import { buildTeamsByFifa, computeEliminatedFifaCodes } from "./elimination";
import { buildSweepstakesResponse } from "./sweepstakes";

/**
 * Builds the sweepstakes payload from the upstream tournament feed.
 *
 * The `use cache` directive lets Next prerender the worldcup routes into a
 * static shell at build time. `cacheLife("hours")` revalidates the cached
 * result every hour (stale-while-revalidate), which is the data-refresh
 * cadence the dashboard needs — no request-driven in-memory poller required.
 *
 * Fetch failures degrade gracefully: participants come from a static file, so
 * we still render every participant as "active" and surface the error in the
 * status banner rather than failing the prerender.
 */
export async function getSweepstakesData(): Promise<SweepstakesResponse> {
  "use cache";
  cacheLife("hours");

  try {
    const snapshot = tournamentConfig.mockTournament
      ? getMockTournamentSnapshot()
      : await fetchTournamentSnapshot();

    const teamsByFifa = buildTeamsByFifa(snapshot.teams);
    const poller: PollerState = {
      eliminatedFifaCodes: computeEliminatedFifaCodes(snapshot),
      teamsByFifa,
      games: snapshot.games,
      updatedAt: new Date().toISOString(),
      stale: false,
    };

    const participantsFile = getParticipantsFile([...teamsByFifa.values()]);
    return buildSweepstakesResponse(participantsFile, poller);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Tournament data refresh failed:", message);

    const poller: PollerState = {
      eliminatedFifaCodes: new Set(),
      teamsByFifa: new Map(),
      games: [],
      updatedAt: new Date().toISOString(),
      stale: true,
      error: message,
    };

    return buildSweepstakesResponse(getParticipantsFile([]), poller);
  }
}
