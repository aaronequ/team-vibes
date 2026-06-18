export type TeamStatus = "active" | "eliminated";

export interface ParticipantsFile {
  title: string;
  participants: ParticipantEntry[];
}

export interface ParticipantEntry {
  name: string;
  countries: { fifaCode: string }[];
}

export interface ApiTeam {
  id: string;
  name_en: string;
  fifa_code: string;
  iso2: string;
  flag: string;
  groups: string;
}

export interface ApiGroupStanding {
  team_id: string;
  mp: string;
  w: string;
  l: string;
  d: string;
  pts: string;
  gf: string;
  ga: string;
  gd: string;
}

export interface ApiGroup {
  name: string;
  teams: ApiGroupStanding[];
}

export interface ApiGame {
  id: string;
  home_team_id: string;
  away_team_id: string;
  home_score: string;
  away_score: string;
  group: string;
  finished?: string | null;
  type: string;
  local_date?: string;
  persian_date?: string;
  matchday?: string;
  time_elapsed?: string;
  home_team_name_en?: string;
  away_team_name_en?: string;
  home_team_label?: string;
  away_team_label?: string;
}

export interface TournamentSnapshot {
  teams: ApiTeam[];
  groups: ApiGroup[];
  games: ApiGame[];
}

export interface NextMatch {
  opponentName: string;
  opponentFifaCode?: string;
  opponentFlagUrl: string;
  kickoffISO: string;
  kickoffDateLabel: string;
  kickoffTimeLabel: string;
  stage: string;
}

export interface CountryAssignment {
  fifaCode: string;
  name: string;
  flagUrl: string;
  status: TeamStatus;
  nextMatch?: NextMatch | null;
}

export interface ParticipantView {
  name: string;
  countries: CountryAssignment[];
  status: TeamStatus;
}

export interface SweepstakesResponse {
  title: string;
  participants: ParticipantView[];
  summary: {
    total: number;
    stillIn: number;
    eliminated: number;
  };
  status: {
    updatedAt: string;
    stale: boolean;
    error?: string;
  };
}

export interface PollerState {
  eliminatedFifaCodes: Set<string>;
  teamsByFifa: Map<string, ApiTeam>;
  games: ApiGame[];
  updatedAt: string | null;
  stale: boolean;
  error?: string;
}

export type SortMethod = "name" | "still-in-first";
