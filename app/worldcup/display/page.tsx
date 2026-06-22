import type { Metadata } from "next";

import { DisplayBoard } from "../components/DisplayBoard";
import { loadParticipantsFile } from "../lib/participants";

export function generateMetadata(): Metadata {
  return { title: `${loadParticipantsFile().title} — Display` };
}

export default function WorldCupDisplayPage() {
  return <DisplayBoard />
}
