import type { Metadata } from "next";

import { DisplayBoard } from "../components/DisplayBoard";
import { loadParticipantsFile } from "../lib/participants";

export function generateMetadata(): Metadata {
  return { title: `${loadParticipantsFile().title} — Display` };
}

// Signage board for Fusion Signage on LG webOS / older SoC webviews. Uses
// DisplayBoard, which ships its own inline old-browser-safe CSS instead of the
// app's Tailwind v4 styles (which those engines cannot parse). Fully
// server-rendered static HTML, refreshed hourly via the `use cache` layer.
export default function WorldCupDisplayPage() {
  return <DisplayBoard />;
}
