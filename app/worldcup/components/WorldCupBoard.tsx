import { Suspense } from "react";

import { formatUpdatedAt } from "../lib/sortParticipants";
import { getSweepstakesData } from "../lib/tournament/data";
import { BallGame } from "./BallGame";
import { ParticipantGrid } from "./ParticipantGrid";
import { SortDropdown } from "./SortDropdown";
import { SummaryBar } from "./SummaryBar";

interface WorldCupBoardProps {
  /** Display mode hides the interactive controls (sort + ball game). */
  displayMode?: boolean;
}

export async function WorldCupBoard({
  displayMode = false,
}: WorldCupBoardProps) {
  const data = await getSweepstakesData();

  const title = data.title;
  const equPrefix = title.match(/^equ/i)?.[0];

  return (
    <div className="relative flex h-screen overflow-hidden bg-equ-stone-2 text-equ-dark">
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
            <p className="text-xs text-white/60 mt-2 leading-relaxed">
              Updated {formatUpdatedAt(data.status.updatedAt)}
            </p>
          </div>

          <SummaryBar
            total={data.summary.total}
            stillIn={data.summary.stillIn}
            eliminated={data.summary.eliminated}
            layout="vertical"
          />
          {!displayMode && (
            <Suspense fallback={null}>
              <SortDropdown layout="stacked" />
            </Suspense>
          )}
        </div>

        {!displayMode && <BallGame />}
      </aside>

      <main className="relative z-10 flex-1 overflow-y-auto p-5 pb-14 min-w-0">
        {data.status.error && (
          <div className="mb-4 bg-equ-salmon-light border border-equ-salmon/40 rounded-lg p-3 text-sm text-equ-dark">
            Tournament data refresh failed: {data.status.error}
          </div>
        )}

        <Suspense fallback={null}>
          <ParticipantGrid
            participants={data.participants}
            fixedSort={displayMode}
          />
        </Suspense>
      </main>
    </div>
  );
}
