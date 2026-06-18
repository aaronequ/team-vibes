import { cacheLife } from "next/cache";
import { PHASE_PRODUCTION_BUILD } from "next/constants";

import { loadParticipantsFile } from "../participants";
import type { PollerState, SweepstakesResponse } from "../types";
import { fetchTournamentSnapshot, getMockTournamentSnapshot } from "./client";
import { tournamentConfig } from "./config";
import { buildTeamsByFifa, computeEliminatedFifaCodes } from "./elimination";
import {
  buildFallbackSweepstakesResponse,
  buildSweepstakesResponse,
} from "./sweepstakes";

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

  // Next warms `use cache` entries during `next build`, which would call the
  // tournament API from the build machine — it's usually unreachable there and
  // logs a build-time fetch error. Skip the network at build and cache a
  // short-lived fallback so the first real request revalidates with live data
  // within seconds (or misses the expired entry and fetches live immediately).
  if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) {
    cacheLife("seconds");
    return buildFallbackSweepstakesResponse(loadParticipantsFile());
  }

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

    const participantsFile = loadParticipantsFile();
    return buildSweepstakesResponse(participantsFile, poller);
  } catch (err) {
    // Next.js 16's use cache runtime tries to set DOMException.message when
    // re-throwing, but that property is read-only, causing an unhandledRejection.
    // Wrap it in a plain Error so the rethrow is safe.
    if (err instanceof DOMException) {
      throw new Error(`${err.name}: ${err.message}`);
    }
    // Rethrowing lets `use cache` serve the last successful cached entry
    // (stale-while-revalidate) instead of caching the error state itself.
    throw err;
  }
}
