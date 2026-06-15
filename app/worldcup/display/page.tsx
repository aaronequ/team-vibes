import type { Metadata } from "next";

import { WorldCupBoard } from "../components/WorldCupBoard";
import { loadParticipantsFile } from "../lib/participants";

export function generateMetadata(): Metadata {
  return { title: `${loadParticipantsFile().title} — Display` };
}

// Static, server-rendered display board. The former `?mode=display` query
// param is now a route segment so it prerenders as its own page; the
// tournament data is supplied by the hourly-revalidated `use cache` layer.
export default function WorldCupDisplayPage() {
  return <WorldCupBoard displayMode />;
}
