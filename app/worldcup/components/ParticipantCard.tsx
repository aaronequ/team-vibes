import type { ParticipantView } from "../lib/types";
import { CountryFlag } from "./CountryFlag";

interface ParticipantCardProps {
  participant: ParticipantView;
}

export function ParticipantCard({ participant }: ParticipantCardProps) {
  const isOut = participant.status === "eliminated";

  return (
    <article
      className={`bg-white rounded-xl border p-4 shadow-sm transition-opacity ${
        isOut ? "border-equ-stone-3 opacity-70" : "border-equ-stone-3"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h2
          className={`text-base font-semibold text-equ-dark ${isOut ? "text-equ-slate" : ""}`}
        >
          {participant.name}
        </h2>
        {isOut && (
          <span className="shrink-0 text-xs font-medium uppercase tracking-wide text-equ-red bg-equ-salmon-light px-2 py-0.5 rounded">
            Out
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-4">
        {participant.countries.map((country) => (
          <CountryFlag
            key={country.fifaCode}
            name={country.name}
            flagUrl={country.flagUrl}
            status={country.status}
            nextMatch={country.nextMatch}
          />
        ))}
      </div>
    </article>
  );
}
