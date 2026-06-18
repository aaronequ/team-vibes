import type {
  ApiGame,
  ApiTeam,
  NextMatch,
  ParticipantView,
  ParticipantsFile,
  PollerState,
  SweepstakesResponse,
  TeamStatus,
} from "../types";

// The worldcup26.ir feed expresses kickoff times in Iran Standard Time
// (UTC+03:30) — `local_date` and `persian_date` share the same clock value.
// We anchor on that offset and render in Western Australia time below.
const SOURCE_TZ_OFFSET_MIN = 210;

const perthDateFormatter = new Intl.DateTimeFormat("en-AU", {
  timeZone: "Australia/Perth",
  weekday: "short",
  day: "numeric",
  month: "short",
});

const perthTimeFormatter = new Intl.DateTimeFormat("en-AU", {
  timeZone: "Australia/Perth",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

function teamStatus(fifaCode: string, poller: PollerState): TeamStatus {
  return poller.eliminatedFifaCodes.has(fifaCode.toUpperCase())
    ? "eliminated"
    : "active";
}

function isFinished(game: ApiGame): boolean {
  return game.finished?.toUpperCase() === "TRUE";
}

function parseSourceKickoff(localDate: string | undefined): Date | null {
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})/.exec(
    localDate ?? "",
  );
  if (!match) return null;

  const month = Number(match[1]);
  const day = Number(match[2]);
  const year = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);

  const utcMs =
    Date.UTC(year, month - 1, day, hour, minute) - SOURCE_TZ_OFFSET_MIN * 60000;
  return new Date(utcMs);
}

function findNextMatch(
  teamId: string,
  games: ApiGame[],
  teamsById: Map<string, ApiTeam>,
  now: number,
): NextMatch | null {
  const candidates = games
    .filter(
      (g) =>
        (g.home_team_id === teamId || g.away_team_id === teamId) &&
        !isFinished(g),
    )
    .map((g) => ({ game: g, when: parseSourceKickoff(g.local_date) }))
    .filter((c): c is { game: ApiGame; when: Date } => c.when !== null)
    .sort((a, b) => a.when.getTime() - b.when.getTime());

  if (candidates.length === 0) return null;

  // Prefer the next match that has not kicked off yet; otherwise fall back to
  // the earliest unfinished fixture (e.g. one currently in progress).
  const chosen =
    candidates.find((c) => c.when.getTime() >= now) ?? candidates[0];

  const game = chosen.game;
  const isHome = game.home_team_id === teamId;
  const opponentId = isHome ? game.away_team_id : game.home_team_id;
  const opponent =
    opponentId && opponentId !== "0" ? teamsById.get(opponentId) : undefined;
  const opponentLabel = isHome ? game.away_team_label : game.home_team_label;

  return {
    opponentName: opponent?.name_en ?? opponentLabel ?? "TBD",
    opponentFifaCode: opponent?.fifa_code?.toUpperCase(),
    opponentFlagUrl: opponent?.flag ?? "",
    kickoffISO: chosen.when.toISOString(),
    kickoffDateLabel: perthDateFormatter.format(chosen.when),
    kickoffTimeLabel: `${perthTimeFormatter.format(chosen.when)} AWST`,
    stage: game.type,
  };
}

export function buildFallbackSweepstakesResponse(
  participantsFile: ParticipantsFile,
): SweepstakesResponse {
  const participants: ParticipantView[] = participantsFile.participants.map(
    (entry) => ({
      name: entry.name,
      countries: entry.countries.map((c) => ({
        fifaCode: c.fifaCode.toUpperCase(),
        name: c.fifaCode.toUpperCase(),
        flagUrl: "",
        status: "active" as TeamStatus,
        nextMatch: null,
      })),
      status: "active" as TeamStatus,
    }),
  );

  return {
    title: participantsFile.title,
    participants,
    summary: { total: participants.length, stillIn: participants.length, eliminated: 0 },
    status: { updatedAt: new Date().toISOString(), stale: true },
  };
}

export function buildSweepstakesResponse(
  participantsFile: ParticipantsFile,
  poller: PollerState,
): SweepstakesResponse {
  const teamsById = new Map(
    [...poller.teamsByFifa.values()].map((t) => [t.id, t]),
  );
  const now = Date.now();

  const participants: ParticipantView[] = participantsFile.participants.map(
    (entry) => {
      const countries = entry.countries.map((c) => {
        const code = c.fifaCode.toUpperCase();
        const team = poller.teamsByFifa.get(code);
        const status = teamStatus(code, poller);
        return {
          fifaCode: code,
          name: team?.name_en ?? code,
          flagUrl: team?.flag ?? "",
          status,
          nextMatch:
            team && status === "active"
              ? findNextMatch(team.id, poller.games, teamsById, now)
              : null,
        };
      });

      const status: TeamStatus = countries.every(
        (c) => c.status === "eliminated",
      )
        ? "eliminated"
        : "active";

      return { name: entry.name, countries, status };
    },
  );

  const stillIn = participants.filter((p) => p.status === "active").length;

  return {
    title: participantsFile.title,
    participants,
    summary: {
      total: participants.length,
      stillIn,
      eliminated: participants.length - stillIn,
    },
    status: {
      updatedAt: poller.updatedAt ?? new Date().toISOString(),
      stale: poller.stale,
      error: poller.error,
    },
  };
}
