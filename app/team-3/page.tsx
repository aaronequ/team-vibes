'use client';

import React from 'react';
import { useFitnessTimer } from '@/lib/hooks/useFitnessTimer';
import { TimerDisplay } from './components/TimerDisplay';
import { QuoteDisplay } from './components/QuoteDisplay';
import Image from 'next/image';

export default function Home() {
  const {
    isRunning,
    currentBank,
    currentRound,
    currentPhase,
    timeRemaining,
    quote,
    start,
    pause,
    reset,
    currentTrackName,
    TOTAL_BANKS,
    TOTAL_ROUNDS,
  } = useFitnessTimer();

  const getBackgroundGradient = () => {
    switch (currentPhase) {
      case 'work':
        return 'from-red-950 via-slate-950 to-red-900 text-red-100';
      case 'rest':
        return 'from-teal-950 via-slate-950 to-teal-900 text-teal-100';
      case 'long_rest':
        return 'from-purple-950 via-slate-950 to-purple-900 text-purple-100';
      case 'finished':
        return 'from-amber-950 via-slate-950 to-amber-900 text-amber-100';
      default:
        return 'from-slate-950 via-zinc-950 to-slate-900 text-slate-100';
    }
  };

  const getBeatAnimationClass = () => {
    if (!isRunning) return '';
    switch (currentPhase) {
      case 'work':
        return 'animate-beat-fast';
      case 'rest':
        return 'animate-beat-slow';
      case 'long_rest':
        return 'animate-beat-breath';
      default:
        return '';
    }
  };

  return (
    <div className={`flex flex-col min-h-screen bg-gradient-to-br ${getBackgroundGradient()} ${getBeatAnimationClass()} transition-all duration-1000 overflow-hidden`}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 md:px-8 border-b border-white/5 bg-black/10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Image
            src="/equ-green-transparent-bg.png"
            alt="equ Logo"
            width={48}
            height={25}
            priority
          />
          <span className="text-white/30 font-semibold tracking-[0.3em] text-xs uppercase hidden sm:inline">
            // Vibe Timer Pro
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold tracking-widest text-white/50 bg-white/5 px-3 py-1 rounded-full border border-white/5">
            4 BANKS × 10 ROUNDS
          </span>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 md:py-12 gap-8 md:gap-10">
        
        {/* Bank & Round Indicators */}
        <div className="w-full max-w-md flex flex-col gap-5 px-4">
          {/* Banks */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold tracking-wider text-white/40 uppercase">
                Active Bank
              </span>
              <span className="text-xs font-mono font-bold text-white/70">
                {currentPhase === 'finished' ? '4' : currentPhase === 'idle' ? '0' : currentBank} / {TOTAL_BANKS}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: TOTAL_BANKS }).map((_, i) => {
                const bankNum = i + 1;
                const isActive = currentBank === bankNum && currentPhase !== 'idle' && currentPhase !== 'finished';
                const isCompleted = currentBank > bankNum || currentPhase === 'finished';
                return (
                  <div
                    key={i}
                    className={`h-2 rounded-full transition-all duration-500 ${
                      isActive
                        ? 'bg-gradient-to-r from-red-500 to-orange-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] scale-y-110'
                        : isCompleted
                        ? 'bg-emerald-500/80'
                        : 'bg-white/10'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Rounds within current bank */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold tracking-wider text-white/40 uppercase">
                Round Progress
              </span>
              <span className="text-xs font-mono font-bold text-white/70">
                {currentPhase === 'finished' ? '10' : currentPhase === 'idle' ? '0' : currentRound} / {TOTAL_ROUNDS}
              </span>
            </div>
            <div className="grid grid-cols-10 gap-1.5">
              {Array.from({ length: TOTAL_ROUNDS }).map((_, i) => {
                const roundNum = i + 1;
                const isActive = currentRound === roundNum && currentPhase !== 'idle' && currentPhase !== 'finished' && currentPhase !== 'long_rest';
                const isCompleted = currentRound > roundNum || currentPhase === 'long_rest' || currentPhase === 'finished';
                return (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      isActive
                        ? 'bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.6)] scale-y-110'
                        : isCompleted
                        ? 'bg-sky-500/40'
                        : 'bg-white/10'
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Central Display Ring */}
        <TimerDisplay timeRemaining={timeRemaining} currentPhase={currentPhase} />

        {/* Quotes Display (only when on long rest or if we want a default starting quote) */}
        <QuoteDisplay quote={quote} isVisible={currentPhase === 'long_rest'} />

        {/* Playback & Action Controls */}
        <div className="flex items-center gap-6 mt-2">
          {/* Reset Button */}
          <button
            onClick={reset}
            className="flex items-center justify-center w-14 h-14 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 active:scale-95 transition-all duration-200"
            title="Reset Workout"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3m-3-3v12"
              />
            </svg>
          </button>

          {/* Start / Pause Button */}
          {isRunning ? (
            <button
              onClick={pause}
              className="flex items-center justify-center w-20 h-20 rounded-full bg-white/90 hover:bg-white text-slate-950 active:scale-95 shadow-[0_4px_20px_rgba(255,255,255,0.2)] transition-all duration-200"
              title="Pause Timer"
            >
              <svg
                className="w-8 h-8 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            </button>
          ) : (
            <button
              onClick={start}
              className={`flex items-center justify-center w-20 h-20 rounded-full active:scale-95 transition-all duration-200 shadow-lg ${
                currentPhase === 'finished'
                  ? 'bg-yellow-500 hover:bg-yellow-400 text-black shadow-yellow-500/20'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/20'
              }`}
              title="Start Workout"
            >
              <svg
                className="w-8 h-8 fill-current ml-1"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          )}

          {/* Mute/Sound hint indicator (Visual-only for aesthetics) */}
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white/5 text-white/40 border border-white/5">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              />
            </svg>
          </div>
        </div>

        {/* Now Playing Widget */}
        <div className="w-full max-w-sm px-4 py-3 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md flex items-center justify-between text-left shadow-lg mt-2 transition-all duration-500 hover:bg-black/50">
          <div className="flex items-center gap-3 min-w-0">
            {/* Tiny sleek visual player preview container to bypass YouTube background restrictions */}
            <div className="relative w-20 h-12 rounded-lg overflow-hidden border border-white/15 bg-neutral-950 shrink-0 shadow-inner">
              <div id="youtube-player-container" className="w-full h-full object-cover pointer-events-none" />
              {/* Overlay pulse glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            </div>

            <div className="min-w-0">
              <p className="text-[9px] font-bold tracking-widest text-white/35 uppercase leading-none mb-1">
                Streaming Media
              </p>
              <p className="text-xs font-semibold text-white/90 truncate max-w-[130px] md:max-w-[160px]">
                {currentTrackName || 'Idle'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isRunning && currentPhase !== 'idle' && currentPhase !== 'finished' ? (
              <div className="flex items-end gap-[2.5px] h-3.5 px-1">
                <div className="w-[2.5px] h-3 bg-red-500 rounded-full animate-[bounce_0.5s_infinite]" />
                <div className="w-[2.5px] h-2 bg-red-500 rounded-full animate-[bounce_0.7s_infinite_0.15s]" />
                <div className="w-[2.5px] h-3.5 bg-red-500 rounded-full animate-[bounce_0.4s_infinite_0.3s]" />
              </div>
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center border-t border-white/5 bg-black/10 backdrop-blur-md text-xs text-white/30 font-semibold tracking-wider uppercase">
        Designed for proper vibe coding sessions
      </footer>
    </div>
  );
}
