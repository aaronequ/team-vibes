import { Suspense } from "react";
import { connection } from "next/server";
import type { Metadata } from "next";

import { DisplayBoard } from "../components/DisplayBoard";
import { loadParticipantsFile } from "../lib/participants";

export function generateMetadata(): Metadata {
  return { title: `${loadParticipantsFile().title} — Display` };
}

// `connection()` must be called inside a child component wrapped in <Suspense>
// (required by this version of Next.js). It opts the component out of
// build-time prerendering so the tournament API is not called during
// `next build` (Vercel build machines cannot reach it).
async function DisplayBoardDeferred() {
  await connection();
  return <DisplayBoard />;
}

export default function WorldCupDisplayPage() {
  return (
    <Suspense fallback={null}>
      <DisplayBoardDeferred />
    </Suspense>
  );
}
