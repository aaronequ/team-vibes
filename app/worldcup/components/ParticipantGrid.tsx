"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

import { sortParticipants } from "../lib/sortParticipants";
import type { ParticipantView, SortMethod } from "../lib/types";
import { ParticipantCard } from "./ParticipantCard";

interface ParticipantGridProps {
  participants: ParticipantView[];
  /**
   * When true (display mode) the grid renders a fixed order and ignores the
   * `?sort` query param — there is no sort control on the display board.
   */
  fixedSort?: boolean;
}

/**
 * Reading `?sort` on the client (rather than from server `searchParams`) keeps
 * the page out of dynamic rendering: the prerendered shell ships the default
 * "still-in-first" order and the client re-sorts after hydration.
 */
export function ParticipantGrid({
  participants,
  fixedSort = false,
}: ParticipantGridProps) {
  const searchParams = useSearchParams();
  const sortBy: SortMethod =
    !fixedSort && searchParams.get("sort") === "name"
      ? "name"
      : "still-in-first";

  const sorted = useMemo(
    () => sortParticipants(participants, sortBy),
    [participants, sortBy],
  );

  return (
    <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(min(100%,16rem),1fr))] auto-rows-fr">
      {sorted.map((participant) => (
        <ParticipantCard key={participant.name} participant={participant} />
      ))}
    </div>
  );
}
