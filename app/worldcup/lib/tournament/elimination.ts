import type {
  ApiGame,
  ApiGroup,
  ApiGroupStanding,
  ApiTeam,
  TournamentSnapshot,
} from "../types";

const KNOCKOUT_TYPES = new Set(["r32", "r16", "qf", "sf", "final"]);
const MATCHES_PER_GROUP = 6;

function parseNum(value: string): number {
  const n = parseInt(value, 10);
  return Number.isFinite(n) ? n : 0;
}

function isFinished(game: ApiGame): boolean {
  return game.finished.toUpperCase() === "TRUE";
}

function compareStandings(a: ApiGroupStanding, b: ApiGroupStanding): number {
  const ptsDiff = parseNum(b.pts) - parseNum(a.pts);
  if (ptsDiff !== 0) return ptsDiff;

  const gdDiff = parseNum(b.gd) - parseNum(a.gd);
  if (gdDiff !== 0) return gdDiff;

  return parseNum(b.gf) - parseNum(a.gf);
}

function rankGroupTeams(group: ApiGroup): ApiGroupStanding[] {
  return [...group.teams].sort(compareStandings);
}

function groupMatchesComplete(groupName: string, games: ApiGame[]): boolean {
  const groupGames = games.filter(
    (g) => g.type === "group" && g.group === groupName,
  );
  if (groupGames.length === 0) return false;
  return groupGames.filter(isFinished).length >= MATCHES_PER_GROUP;
}

function allGroupStageComplete(games: ApiGame[]): boolean {
  const groupGames = games.filter((g) => g.type === "group");
  if (groupGames.length === 0) return false;
  return groupGames.every(isFinished);
}

function teamIdToFifa(
  teamId: string,
  teamsById: Map<string, ApiTeam>,
): string | null {
  const team = teamsById.get(teamId);
  return team?.fifa_code.toUpperCase() ?? null;
}

function resolveKnockoutLoser(
  game: ApiGame,
  teamsById: Map<string, ApiTeam>,
): string | null {
  const homeId = game.home_team_id;
  const awayId = game.away_team_id;
  if (homeId === "0" || awayId === "0") return null;

  const homeScore = parseNum(game.home_score);
  const awayScore = parseNum(game.away_score);
  if (homeScore === awayScore) return null;

  const loserId = homeScore < awayScore ? homeId : awayId;
  return teamIdToFifa(loserId, teamsById);
}

export function computeEliminatedFifaCodes(
  snapshot: TournamentSnapshot,
): Set<string> {
  const eliminated = new Set<string>();
  const teamsById = new Map(snapshot.teams.map((t) => [t.id, t]));
  const teamsByFifa = new Map(
    snapshot.teams.map((t) => [t.fifa_code.toUpperCase(), t]),
  );

  const thirdPlaceCandidates: {
    fifaCode: string;
    standing: ApiGroupStanding;
    group: string;
  }[] = [];

  for (const group of snapshot.groups) {
    if (!groupMatchesComplete(group.name, snapshot.games)) continue;

    const ranked = rankGroupTeams(group);
    if (ranked.length < 4) continue;

    const fourth = ranked[3];
    const fourthFifa = teamIdToFifa(fourth.team_id, teamsById);
    if (fourthFifa) eliminated.add(fourthFifa);

    const third = ranked[2];
    const thirdFifa = teamIdToFifa(third.team_id, teamsById);
    if (thirdFifa) {
      thirdPlaceCandidates.push({
        fifaCode: thirdFifa,
        standing: third,
        group: group.name,
      });
    }
  }

  if (allGroupStageComplete(snapshot.games) && thirdPlaceCandidates.length > 0) {
    const sortedThirds = [...thirdPlaceCandidates].sort((a, b) =>
      compareStandings(a.standing, b.standing),
    );
    const advancingThirds = new Set(
      sortedThirds.slice(0, 8).map((t) => t.fifaCode),
    );

    for (const candidate of thirdPlaceCandidates) {
      if (!advancingThirds.has(candidate.fifaCode)) {
        eliminated.add(candidate.fifaCode);
      }
    }
  }

  for (const game of snapshot.games) {
    if (!isFinished(game) || !KNOCKOUT_TYPES.has(game.type)) continue;

    const loserFifa = resolveKnockoutLoser(game, teamsById);
    if (loserFifa) eliminated.add(loserFifa);
  }

  for (const fifa of eliminated) {
    if (!teamsByFifa.has(fifa)) eliminated.delete(fifa);
  }

  return eliminated;
}

export function buildTeamsByFifa(teams: ApiTeam[]): Map<string, ApiTeam> {
  return new Map(teams.map((t) => [t.fifa_code.toUpperCase(), t]));
}
