"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { GrassStrip } from "./components/GrassStrip";
import { ParticipantCard } from "./components/ParticipantCard";
import { SoccerBallPhysics } from "./components/SoccerBallPhysics";
import { SortDropdown } from "./components/SortDropdown";
import { SummaryBar } from "./components/SummaryBar";
import { isDisplayMode } from "./lib/appMode";
import { formatUpdatedAt, sortParticipants } from "./lib/sortParticipants";
import type { SortMethod } from "./lib/types";
import { useSweepstakes } from "./hooks/useSweepstakes";

function WorldCupDashboard() {
  const { data, loading, error } = useSweepstakes();
  const searchParams = useSearchParams();
  const displayMode = useMemo(
    () => isDisplayMode(searchParams.toString()),
    [searchParams],
  );
  const [sortBy, setSortBy] = useState<SortMethod>("still-in-first");
  const [ballSpawnKey, setBallSpawnKey] = useState(0);

  const title = data?.title ?? "World Cup Sweepstakes";

  useEffect(() => {
    document.title = title;
  }, [title]);

  const sortedParticipants = useMemo(() => {
    if (!data) return [];
    return sortParticipants(data.participants, sortBy);
  }, [data, sortBy]);

  const equPrefix = title.match(/^equ/i)?.[0];

  return (
    <div className="relative flex h-screen overflow-hidden bg-equ-stone-2 text-equ-dark">
      <GrassStrip />

      <aside className="relative z-10 w-64 shrink-0 bg-equ-dark-2 border-r border-equ-slate/30 flex flex-col overflow-y-auto">
        <div className="p-5 flex flex-col gap-5 flex-1">
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight leading-snug">
              {equPrefix ? (
                <>
                  <span className="text-equ-teal">{equPrefix}</span>
                  {title.slice(equPrefix.length)}
                </>
              ) : (
                title
              )}
            </h1>
            {data && (
              <p className="text-xs text-white/60 mt-2 leading-relaxed">
                Updated {formatUpdatedAt(data.status.updatedAt)}
                {data.status.stale && (
                  <span className="block text-equ-salmon mt-0.5">
                    Data may be stale
                  </span>
                )}
              </p>
            )}
          </div>

          {data && (
            <>
              <SummaryBar
                total={data.summary.total}
                stillIn={data.summary.stillIn}
                eliminated={data.summary.eliminated}
                layout="vertical"
              />
              {!displayMode && (
                <SortDropdown
                  value={sortBy}
                  onChange={setSortBy}
                  layout="stacked"
                />
              )}
            </>
          )}
        </div>

        {!displayMode && (
          <div className="p-5 pt-0 mt-auto">
            <button
              type="button"
              onClick={() => setBallSpawnKey((key) => key + 1)}
              className="w-full rounded-md border border-equ-teal/40 bg-equ-teal/10 px-3 py-2 text-sm font-medium text-equ-teal transition-colors hover:bg-equ-teal/20 focus:outline-none focus:ring-2 focus:ring-equ-teal focus:ring-offset-2 focus:ring-offset-equ-dark-2"
            >
              Drop ball
            </button>
          </div>
        )}
      </aside>

      {!displayMode && ballSpawnKey > 0 && (
        <SoccerBallPhysics key={ballSpawnKey} />
      )}

      <main className="relative z-10 flex-1 overflow-y-auto p-5 pb-14 min-w-0">
        {loading && (
          <p className="text-equ-slate text-center py-12">
            Loading sweepstakes…
          </p>
        )}

        {error && !data && (
          <div className="bg-equ-salmon-light border border-equ-salmon/40 rounded-lg p-4 text-equ-dark">
            {error}
          </div>
        )}

        {data && (
          <>
            {data.status.error && (
              <div className="mb-4 bg-equ-salmon-light border border-equ-salmon/40 rounded-lg p-3 text-sm text-equ-dark">
                Tournament data refresh failed: {data.status.error}
              </div>
            )}

            <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(min(100%,16rem),1fr))] auto-rows-fr">
              {sortedParticipants.map((participant) => (
                <ParticipantCard
                  key={participant.name}
                  participant={participant}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default function WorldCupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-equ-stone-2 text-equ-slate">
          Loading sweepstakes…
        </div>
      }
    >
      <WorldCupDashboard />
    </Suspense>
  );
}
