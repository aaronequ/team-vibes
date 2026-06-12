import { tournamentConfig } from "./config";
import type { PollerState } from "../types";
import { fetchTournamentSnapshot, getMockTournamentSnapshot } from "./client";
import { buildTeamsByFifa, computeEliminatedFifaCodes } from "./elimination";

let state: PollerState = {
  eliminatedFifaCodes: new Set(),
  teamsByFifa: new Map(),
  games: [],
  updatedAt: null,
  stale: true,
};

let lastFetchedMs = 0;
let inFlight: Promise<void> | null = null;

async function pollOnce(): Promise<void> {
  try {
    const snapshot = tournamentConfig.mockTournament
      ? getMockTournamentSnapshot()
      : await fetchTournamentSnapshot();

    const eliminatedFifaCodes = computeEliminatedFifaCodes(snapshot);
    const teamsByFifa = buildTeamsByFifa(snapshot.teams);

    state = {
      eliminatedFifaCodes,
      teamsByFifa,
      games: snapshot.games,
      updatedAt: new Date().toISOString(),
      stale: false,
      error: undefined,
    };
    lastFetchedMs = Date.now();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Tournament poll failed:", message);
    state = {
      ...state,
      stale: true,
      error: message,
    };
    // Back off so a hard failure does not hammer the upstream on every request.
    lastFetchedMs = Date.now();
  }
}

function isFresh(): boolean {
  return (
    state.updatedAt !== null &&
    !state.stale &&
    Date.now() - lastFetchedMs < tournamentConfig.pollIntervalMs
  );
}

export async function getPollerState(): Promise<PollerState> {
  if (isFresh()) {
    return state;
  }

  // Dedupe concurrent refreshes triggered by overlapping requests.
  if (!inFlight) {
    inFlight = pollOnce().finally(() => {
      inFlight = null;
    });
  }
  await inFlight;

  return state;
}
