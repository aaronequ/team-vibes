"use client";

import React from 'react';

interface RecipeFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export function RecipeFilters({ activeFilter, onFilterChange }: RecipeFiltersProps) {
  const filters = ["All", "Quick (< 30m)", "Easy", "Fewest Missing"];

  return (
    <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide px-6">
      {filters.map((filter) => {
        const isActive = activeFilter === filter;
        return (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`whitespace-nowrap px-5 py-2 rounded-full font-medium text-sm transition-colors border ${
              isActive 
                ? 'bg-secondary text-white border-secondary' 
                : 'bg-bg-surface text-text-main border-slate-200 hover:border-secondary'
            }`}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}
