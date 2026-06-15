import type { ParticipantView, SortMethod } from "./types";

export function sortParticipants(
  participants: ParticipantView[],
  sortBy: SortMethod,
): ParticipantView[] {
  const list = [...participants];

  if (sortBy === "name") {
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }

  return list.sort((a, b) => {
    if (a.status !== b.status) {
      return a.status === "active" ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });
}

export function formatUpdatedAt(iso: string): string {
  return new Date(iso).toLocaleString("en-AU", {
    timeZone: "Australia/Perth",
    dateStyle: "medium",
    timeStyle: "short",
  });
}
