import type { ReactNode } from "react";

import { formatUpdatedAt, sortParticipants } from "../lib/sortParticipants";
import { getSweepstakesData } from "../lib/tournament/data";
import type { SortMethod } from "../lib/types";
import { ParticipantCard } from "./ParticipantCard";
import { SummaryBar } from "./SummaryBar";

interface WorldCupBoardProps {
  /** Sort order, baked in by the page — the grid is sorted on the server. */
  sortBy?: SortMethod;
  /** Optional interactive sort control (sidebar). Omitted on the display board. */
  sortControl?: ReactNode;
  /** Optional interactive widget (the ball game). Omitted on the display board. */
  ballGame?: ReactNode;
}

/**
 * Pure server component: renders the whole board to static HTML. It imports no
 * client components — interactive pieces are injected as `sortControl` /
 * `ballGame` slots by the interactive route only, so the display route ships
 * zero client JavaScript.
 */
export async function WorldCupBoard({
  sortBy = "still-in-first",
  sortControl,
  ballGame,
}: WorldCupBoardProps) {
  let data;
  try {
    data = await getSweepstakesData();
  } catch {
    return (
      <div className="relative flex h-screen overflow-hidden bg-equ-stone-2 text-equ-dark">
        <aside className="relative z-10 w-64 shrink-0 bg-equ-dark-2 border-r border-equ-slate/30 flex flex-col overflow-y-auto">
          <div className="p-5 flex flex-col gap-5 flex-1">{sortControl}</div>
          {ballGame}
        </aside>
        <main className="relative z-10 flex-1 overflow-y-auto p-5">
          <div className="bg-equ-salmon-light border border-equ-salmon/40 rounded-lg p-3 text-sm text-equ-dark">
            Tournament data unavailable — will retry automatically.
          </div>
        </main>
      </div>
    );
  }

  const participants = sortParticipants(data.participants, sortBy);

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
          {sortControl}
        </div>

        {ballGame}
      </aside>

      <main className="relative z-10 flex-1 overflow-y-auto p-5 pb-14 min-w-0">
        <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(min(100%,16rem),1fr))] auto-rows-fr">
          {participants.map((participant) => (
            <ParticipantCard key={participant.name} participant={participant} />
          ))}
        </div>
      </main>
    </div>
  );
}
