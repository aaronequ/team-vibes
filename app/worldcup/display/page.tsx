import { connection } from "next/server";
import type { Metadata } from "next";

import { DisplayBoard } from "../components/DisplayBoard";
import { loadParticipantsFile } from "../lib/participants";

export function generateMetadata(): Metadata {
  return { title: `${loadParticipantsFile().title} — Display` };
}

// `connection()` opts this page out of build-time prerendering so the
// tournament API is not called during `next build` (Vercel build machines
// cannot reach it). The page renders synchronously at request time — no
// Suspense/streaming — so it works on JS-less webOS signage panels.
export default async function WorldCupDisplayPage() {
  await connection();
  return <DisplayBoard />;
}
