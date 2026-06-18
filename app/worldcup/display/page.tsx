import { Suspense } from "react";
import type { Metadata } from "next";

import { DisplayBoard } from "../components/DisplayBoard";
import { loadParticipantsFile } from "../lib/participants";

export function generateMetadata(): Metadata {
  return { title: `${loadParticipantsFile().title} — Display` };
}

// Signage board for Fusion Signage on LG webOS / older SoC webviews.
// DisplayBoard is wrapped in Suspense so it streams at request time — the
// `use cache` inside populates on first request rather than at build time,
// which avoids a build failure when the tournament API is unreachable from
// Vercel's build machines.
export default function WorldCupDisplayPage() {
  return (
    <Suspense fallback={null}>
      <DisplayBoard />
    </Suspense>
  );
}
