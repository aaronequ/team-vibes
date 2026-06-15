import type { Metadata } from "next";

import { WorldCupBoard } from "../components/WorldCupBoard";
import { loadParticipantsFile } from "../lib/participants";

export function generateMetadata(): Metadata {
  return { title: `${loadParticipantsFile().title} — Display` };
}

// Pure static HTML. WorldCupBoard imports no client components and we pass no
// interactive slots, so this route ships zero client JavaScript. Tournament
// data comes from the hourly-revalidated `use cache` layer, so the page is
// prerendered at build and refreshed every hour.
export default function WorldCupDisplayPage() {
  return <WorldCupBoard />;
}
