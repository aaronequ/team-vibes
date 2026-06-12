import type { SortMethod } from "../lib/types";

interface SortDropdownProps {
  value: SortMethod;
  onChange: (value: SortMethod) => void;
  layout?: "inline" | "stacked";
}

const OPTIONS: { value: SortMethod; label: string }[] = [
  { value: "still-in-first", label: "Still in first" },
  { value: "name", label: "Name (A–Z)" },
];

export function SortDropdown({
  value,
  onChange,
  layout = "inline",
}: SortDropdownProps) {
  const isStacked = layout === "stacked";

  return (
    <label
      className={
        isStacked
          ? "flex flex-col gap-1.5 text-sm text-white/70"
          : "flex items-center gap-2 text-sm text-equ-slate"
      }
    >
      <span
        className={
          isStacked
            ? "text-xs uppercase tracking-wide text-white/50"
            : undefined
        }
      >
        Sort
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortMethod)}
        className="w-full rounded-md border border-white/15 bg-equ-dark px-2 py-1.5 text-white shadow-sm focus:border-equ-teal focus:outline-none focus:ring-1 focus:ring-equ-teal"
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
