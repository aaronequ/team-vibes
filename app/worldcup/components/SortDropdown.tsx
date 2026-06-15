"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import type { SortMethod } from "../lib/types";

interface SortDropdownProps {
  layout?: "inline" | "stacked";
}

const OPTIONS: { value: SortMethod; label: string }[] = [
  { value: "still-in-first", label: "Still in first" },
  { value: "name", label: "Name (A–Z)" },
];

export function SortDropdown({ layout = "inline" }: SortDropdownProps) {
  const searchParams = useSearchParams();
  const value: SortMethod =
    searchParams.get("sort") === "name" ? "name" : "still-in-first";
  const isStacked = layout === "stacked";

  return (
    <div
      className={
        isStacked
          ? "flex flex-col gap-1.5 text-sm text-white/70"
          : "flex items-center gap-2 text-sm text-equ-slate"
      }
    >
      <span className="text-xs uppercase tracking-wide text-white/50">Sort</span>
      <div className="flex flex-wrap gap-1.5">
        {OPTIONS.map((opt) => {
          const active = opt.value === value;
          return (
            <Link
              key={opt.value}
              href={`?sort=${opt.value}`}
              scroll={false}
              aria-current={active ? "true" : undefined}
              className={`rounded-md border px-2 py-1.5 text-xs font-medium transition-colors ${
                active
                  ? "border-equ-teal bg-equ-teal/20 text-equ-teal"
                  : "border-white/15 bg-equ-dark text-white/80 hover:border-equ-teal/50 hover:text-white"
              }`}
            >
              {opt.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
