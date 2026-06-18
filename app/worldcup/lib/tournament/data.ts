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
 * Fetch failures rethrow so `use cache` falls back to the last successful
 * cached entry rather than caching the error state for up to its expire window.
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
    console.error("Tournament data refresh failed:", err);
    // Rethrowing lets `use cache` serve the last successful cached entry
    // (stale-while-revalidate) instead of caching the error state itself.
    throw err;
  }
}
