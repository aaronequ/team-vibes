import React from "react";

interface LoadingScannerProps {
  phase?: "preparing" | "uploading" | "analyzing" | "processing";
}

const PHASE_COPY: Record<
  NonNullable<LoadingScannerProps["phase"]>,
  { title: string; subtitle: string; progress: number }
> = {
  preparing: {
    title: "Preparing Photo...",
    subtitle: "Optimizing your image for a fast scan",
    progress: 20,
  },
  uploading: {
    title: "Uploading Photo...",
    subtitle: "Sending image to the scan service",
    progress: 45,
  },
  analyzing: {
    title: "Analyzing Ingredients...",
    subtitle: "AI is identifying what is in your photo",
    progress: 75,
  },
  processing: {
    title: "Finalizing Results...",
    subtitle: "Building your ingredient list",
    progress: 95,
  },
};

export default function LoadingScanner({
  phase = "analyzing",
}: LoadingScannerProps) {
  const copy = PHASE_COPY[phase];

  return (
    <div className="flex flex-col items-center justify-center h-[100dvh] p-8 text-center bg-bg-main space-y-8">
      <div className="relative w-48 h-48 rounded-3xl overflow-hidden border border-slate-200 bg-bg-surface card-shadow">
        <div className="absolute inset-0 flex items-center justify-center text-6xl">
          🥗
        </div>

        {/* Scanning line animation */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-primary shadow-[0_0_20px_rgba(16,185,129,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>

        {/* Rotating highlight ring */}
        <div className="absolute inset-2 rounded-2xl border-2 border-primary/25 animate-[spin_3s_linear_infinite]"></div>
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-bold animate-pulse text-secondary">
          {copy.title}
        </h2>
        <p className="text-text-main font-medium">{copy.subtitle}</p>
      </div>

      <div
        className="w-full max-w-xs space-y-2"
        aria-live="polite"
        aria-label="Scan progress"
      >
        <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full bg-primary transition-[width] duration-500 ease-out"
            style={{ width: `${copy.progress}%` }}
          />
        </div>
        <div className="flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-2 h-2 rounded-full bg-primary animate-bounce"></span>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `,
        }}
      />
    </div>
  );
}
