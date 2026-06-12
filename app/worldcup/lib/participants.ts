import type { ApiTeam, ParticipantsFile } from "./types";

const RAW_PARTICIPANTS: ParticipantsFile = {
  title: "equ World Cup 2026",
  participants: [
    {
      name: "Adam Butterworth",
      countries: [{ fifaCode: "ARG" }, { fifaCode: "CAN" }, { fifaCode: "MAR" }],
    },
    {
      name: "Alex Chisem",
      countries: [{ fifaCode: "COD" }],
    },
    {
      name: "Caitlyn Johnson",
      countries: [{ fifaCode: "IRN" }, { fifaCode: "EGY" }, { fifaCode: "COL" }],
    },
    {
      name: "Claire Aindow",
      countries: [{ fifaCode: "CPV" }, { fifaCode: "QAT" }, { fifaCode: "URU" }],
    },
    {
      name: "Eduardo Gallardo",
      countries: [{ fifaCode: "CRO" }],
    },
    {
      name: "James Florido",
      countries: [{ fifaCode: "HAI" }, { fifaCode: "TUR" }, { fifaCode: "UZB" }],
    },
    {
      name: "Jason Carle",
      countries: [{ fifaCode: "MEX" }, { fifaCode: "SWE" }, { fifaCode: "JOR" }],
    },
    {
      name: "Jess Stanley",
      countries: [{ fifaCode: "POR" }, { fifaCode: "SUI" }, { fifaCode: "BRA" }],
    },
    {
      name: "Jon Aindow",
      countries: [{ fifaCode: "ECU" }, { fifaCode: "AUS" }, { fifaCode: "SCO" }],
    },
    {
      name: "Kati Robertson",
      countries: [{ fifaCode: "CZE" }, { fifaCode: "FRA" }, { fifaCode: "IRQ" }],
    },
    {
      name: "Phil Ioppolo",
      countries: [{ fifaCode: "KOR" }, { fifaCode: "CUW" }, { fifaCode: "GHA" }],
    },
    {
      name: "Regan Shepherd",
      countries: [{ fifaCode: "ENG" }, { fifaCode: "PAN" }, { fifaCode: "AUT" }],
    },
    {
      name: "Robert Gillman",
      countries: [{ fifaCode: "ESP" }],
    },
    {
      name: "Ryan Weber",
      countries: [{ fifaCode: "RSA" }, { fifaCode: "JPN" }, { fifaCode: "NED" }],
    },
    {
      name: "Sean Molam",
      countries: [{ fifaCode: "KSA" }, { fifaCode: "ALG" }, { fifaCode: "USA" }],
    },
    {
      name: "Siobhán McGurrin",
      countries: [{ fifaCode: "NOR" }, { fifaCode: "TUN" }, { fifaCode: "BEL" }],
    },
    {
      name: "Skye Harvey",
      countries: [{ fifaCode: "NZL" }, { fifaCode: "GER" }, { fifaCode: "CIV" }],
    },
    {
      name: "Warren Duff",
      countries: [{ fifaCode: "BIH" }, { fifaCode: "PAR" }, { fifaCode: "SEN" }],
    },
  ],
};

function parseParticipantsFile(data: ParticipantsFile): ParticipantsFile {
  if (!data.title || typeof data.title !== "string") {
    throw new Error('participants: "title" is required');
  }

  if (!Array.isArray(data.participants) || data.participants.length === 0) {
    throw new Error('participants: "participants" must be a non-empty array');
  }

  for (const participant of data.participants) {
    if (!participant.name?.trim()) {
      throw new Error('participants: each participant needs a "name"');
    }
    if (
      !Array.isArray(participant.countries) ||
      participant.countries.length === 0
    ) {
      throw new Error(
        `participants: "${participant.name}" needs at least one country`,
      );
    }
    for (const country of participant.countries) {
      if (!country.fifaCode?.trim()) {
        throw new Error(
          `participants: "${participant.name}" has a country missing "fifaCode"`,
        );
      }
      country.fifaCode = country.fifaCode.trim().toUpperCase();
    }
  }

  return data;
}

let cache: ParticipantsFile | null = null;

export function loadParticipantsFile(): ParticipantsFile {
  if (!cache) {
    cache = parseParticipantsFile(RAW_PARTICIPANTS);
  }
  return cache;
}

export function findUnknownParticipantCodes(
  participants: ParticipantsFile,
  teams: ApiTeam[],
): string[] {
  const validCodes = new Set(teams.map((t) => t.fifa_code.toUpperCase()));
  const unknown: string[] = [];

  for (const participant of participants.participants) {
    for (const country of participant.countries) {
      if (!validCodes.has(country.fifaCode)) {
        unknown.push(`${country.fifaCode} (${participant.name})`);
      }
    }
  }

  return unknown;
}

export function getParticipantsFile(teams: ApiTeam[]): ParticipantsFile {
  const data = loadParticipantsFile();

  // Surface unknown FIFA codes as a warning rather than failing the whole
  // dashboard. Unknown codes still render gracefully (the raw code is shown
  // and the country stays "active"), so a single config typo — or the small
  // synthetic team set used by MOCK_TOURNAMENT — should not 500 the page.
  if (teams.length > 0) {
    const unknown = findUnknownParticipantCodes(data, teams);
    if (unknown.length > 0) {
      console.warn(
        `worldcup: ${unknown.length} unknown FIFA code(s) in participants: ${unknown.join(", ")}`,
      );
    }
  }

  return data;
}
