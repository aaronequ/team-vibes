import type { NextMatch, TeamStatus } from "../lib/types";

interface CountryFlagProps {
  name: string;
  flagUrl: string;
  status: TeamStatus;
  nextMatch?: NextMatch | null;
}

export function CountryFlag({
  name,
  flagUrl,
  status,
  nextMatch,
}: CountryFlagProps) {
  const eliminated = status === "eliminated";

  return (
    <div
      className={`relative flex w-[4.5rem] flex-col items-center gap-1 ${eliminated ? "opacity-50" : ""}`}
      title={eliminated ? `${name} — eliminated` : name}
    >
      <div className="relative w-12 h-8 rounded overflow-hidden shadow-sm border border-equ-stone-3 bg-equ-grey-light">
        {flagUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={flagUrl}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-equ-slate">
            ?
          </div>
        )}
        {eliminated && (
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden
            style={{
              background:
                "linear-gradient(to top right, transparent calc(50% - 1px), rgba(227, 30, 54, 0.85), transparent calc(50% + 1px))",
            }}
          />
        )}
      </div>
      <span
        className={`text-xs text-center max-w-[4.5rem] leading-tight ${
          eliminated ? "line-through text-equ-slate" : "text-equ-dark"
        }`}
      >
        {name}
      </span>
      {eliminated ? (
        <span className="mt-0.5 text-[10px] text-equ-slate opacity-70">
          eliminated
        </span>
      ) : (
        nextMatch && (
          <div className="mt-0.5 flex flex-col items-center gap-0.5 text-center leading-tight">
            <span className="text-[10px] text-equ-slate opacity-70">vs</span>
            <span className="flex items-center gap-1 text-[10px] text-equ-slate">
              {nextMatch.opponentFlagUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={nextMatch.opponentFlagUrl}
                  alt=""
                  className="h-2.5 w-4 rounded-[1px] object-cover"
                  loading="lazy"
                />
              )}
              <span className="font-semibold text-equ-dark">
                {nextMatch.opponentFifaCode ?? nextMatch.opponentName}
              </span>
            </span>
            <span className="text-[8px] text-equ-slate opacity-70">
              {nextMatch.kickoffDateLabel}
            </span>
            <span className="text-[8px] text-equ-slate opacity-70">
              {nextMatch.kickoffTimeLabel}
            </span>
          </div>
        )
      )}
    </div>
  );
}
