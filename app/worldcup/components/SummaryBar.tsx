interface SummaryBarProps {
  total: number;
  stillIn: number;
  eliminated: number;
  layout?: "horizontal" | "vertical";
}

export function SummaryBar({
  total,
  stillIn,
  eliminated,
  layout = "horizontal",
}: SummaryBarProps) {
  const isVertical = layout === "vertical";

  return (
    <div className={isVertical ? "flex flex-col gap-3" : "flex flex-wrap gap-3"}>
      <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">
        <p className="text-xs text-white/50 uppercase tracking-wide">
          Participants
        </p>
        <p className="text-2xl font-bold text-white">{total}</p>
      </div>
      <div className="rounded-lg border border-equ-teal/30 bg-equ-teal/10 px-4 py-3">
        <p className="text-xs text-equ-teal uppercase tracking-wide">Still in</p>
        <p className="text-2xl font-bold text-equ-teal">{stillIn}</p>
      </div>
      <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">
        <p className="text-xs text-white/50 uppercase tracking-wide">
          Eliminated
        </p>
        <p className="text-2xl font-bold text-white/70">{eliminated}</p>
      </div>
    </div>
  );
}
