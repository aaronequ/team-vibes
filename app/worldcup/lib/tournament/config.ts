export const tournamentConfig = {
  pollIntervalMs: parseInt(process.env.POLL_INTERVAL_MS || "900000", 10),
  tournamentApiBase: process.env.TOURNAMENT_API_BASE || "https://worldcup26.ir",
  mockTournament: process.env.MOCK_TOURNAMENT === "1",
};
