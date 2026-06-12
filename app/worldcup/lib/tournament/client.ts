import { tournamentConfig } from "./config";
import type {
  ApiGame,
  ApiGroup,
  ApiTeam,
  TournamentSnapshot,
} from "../types";

async function fetchJson<T>(path: string): Promise<T> {
  const url = `${tournamentConfig.tournamentApiBase}${path}`;
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Tournament API ${path} returned ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function fetchTournamentSnapshot(): Promise<TournamentSnapshot> {
  const [teamsPayload, groupsPayload, gamesPayload] = await Promise.all([
    fetchJson<{ teams: ApiTeam[] }>("/get/teams"),
    fetchJson<{ groups: ApiGroup[] }>("/get/groups"),
    fetchJson<{ games: ApiGame[] }>("/get/games"),
  ]);

  return {
    teams: teamsPayload.teams,
    groups: groupsPayload.groups,
    games: gamesPayload.games,
  };
}

export function getMockTournamentSnapshot(): TournamentSnapshot {
  return {
    teams: [
      {
        id: "1",
        name_en: "Mexico",
        fifa_code: "MEX",
        iso2: "MX",
        flag: "https://flagcdn.com/w80/mx.png",
        groups: "A",
      },
      {
        id: "9",
        name_en: "Brazil",
        fifa_code: "BRA",
        iso2: "BR",
        flag: "https://flagcdn.com/w80/br.png",
        groups: "C",
      },
      {
        id: "45",
        name_en: "England",
        fifa_code: "ENG",
        iso2: "ENG",
        flag: "https://flagcdn.com/w80/gb-eng.png",
        groups: "L",
      },
    ],
    groups: [
      {
        name: "A",
        teams: [
          { team_id: "1", mp: "3", w: "3", l: "0", d: "0", pts: "9", gf: "5", ga: "1", gd: "4" },
          { team_id: "2", mp: "3", w: "1", l: "1", d: "1", pts: "4", gf: "3", ga: "3", gd: "0" },
          { team_id: "3", mp: "3", w: "0", l: "2", d: "1", pts: "1", gf: "2", ga: "4", gd: "-2" },
          { team_id: "4", mp: "3", w: "0", l: "2", d: "1", pts: "1", gf: "1", ga: "3", gd: "-2" },
        ],
      },
    ],
    games: [
      {
        id: "73",
        home_team_id: "1",
        away_team_id: "9",
        home_score: "2",
        away_score: "1",
        group: "R32",
        finished: "TRUE",
        type: "r32",
      },
    ],
  };
}
