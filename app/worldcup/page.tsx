import type { Metadata } from "next";

import { WorldCupBoard } from "./components/WorldCupBoard";
import { loadParticipantsFile } from "./lib/participants";

export function generateMetadata(): Metadata {
  return { title: loadParticipantsFile().title };
}

export default function WorldCupPage() {
  return <WorldCupBoard />;
}
