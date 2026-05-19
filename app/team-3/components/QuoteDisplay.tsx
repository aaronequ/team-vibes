import React from 'react';

interface QuoteDisplayProps {
  quote: string;
  isVisible: boolean;
}

export function QuoteDisplay({ quote, isVisible }: QuoteDisplayProps) {
  if (!isVisible) return null;

  return (
    <div className="w-full max-w-xl mx-auto px-6 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-center shadow-lg transition-all duration-1000 animate-pulse">
      <p className="text-white/40 text-xs font-semibold tracking-widest uppercase mb-2">Inspiration</p>
      <blockquote className="text-white/90 text-lg md:text-xl font-light italic leading-relaxed">
        &ldquo;{quote || 'The only bad workout is the one that didn\'t happen.'}&rdquo;
      </blockquote>
    </div>
  );
}
