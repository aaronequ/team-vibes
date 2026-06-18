import type { ParticipantsFile } from "./types";

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

