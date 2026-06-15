import type { Metadata } from "next";
import { Suspense } from "react";

import { BallGame } from "./components/BallGame";
import { SortDropdown } from "./components/SortDropdown";
import { WorldCupBoard } from "./components/WorldCupBoard";
import { loadParticipantsFile } from "./lib/participants";
import type { SortMethod } from "./lib/types";

export function generateMetadata(): Metadata {
  return { title: loadParticipantsFile().title };
}

interface WorldCupPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function WorldCupPage({ searchParams }: WorldCupPageProps) {
  // searchParams is request-time data; isolate it in a Suspense boundary so the
  // route still prerenders a shell. Sort is resolved here and baked into the
  // board as a prop, keeping the grid server-rendered.
  return (
    <Suspense fallback={null}>
      <InteractiveBoard searchParams={searchParams} />
    </Suspense>
  );
}

async function InteractiveBoard({ searchParams }: WorldCupPageProps) {
  const params = await searchParams;
  const sortBy: SortMethod = params.sort === "name" ? "name" : "still-in-first";

  return (
    <WorldCupBoard
      sortBy={sortBy}
      sortControl={<SortDropdown value={sortBy} layout="stacked" />}
      ballGame={<BallGame />}
    />
  );
}
