import React from 'react';

interface TimerDisplayProps {
  timeRemaining: number;
  currentPhase: 'idle' | 'work' | 'rest' | 'long_rest' | 'finished';
}

export function TimerDisplay({ timeRemaining, currentPhase }: TimerDisplayProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseStyles = () => {
    switch (currentPhase) {
      case 'work':
        return {
          glow: 'shadow-[0_0_50px_rgba(239,68,68,0.3)]',
          text: 'text-red-500',
          label: 'WORK',
        };
      case 'rest':
        return {
          glow: 'shadow-[0_0_50px_rgba(20,184,166,0.3)]',
          text: 'text-teal-400',
          label: 'REST',
        };
      case 'long_rest':
        return {
          glow: 'shadow-[0_0_50px_rgba(139,92,246,0.3)]',
          text: 'text-purple-400',
          label: 'EXTENDED REST',
        };
      case 'finished':
        return {
          glow: 'shadow-[0_0_50px_rgba(234,179,8,0.3)]',
          text: 'text-yellow-400',
          label: 'COMPLETED!',
        };
      default:
        return {
          glow: 'shadow-[0_0_50px_rgba(148,163,184,0.15)]',
          text: 'text-slate-400',
          label: 'READY',
        };
    }
  };

  const styles = getPhaseStyles();

  return (
    <div className={`relative flex flex-col items-center justify-center w-72 h-72 md:w-80 md:h-80 rounded-full border-4 border-white/10 bg-black/45 backdrop-blur-md transition-all duration-700 ${styles.glow}`}>
      <span className="text-sm font-semibold tracking-[0.25em] text-white/40 uppercase mb-2">
        {styles.label}
      </span>
      <span className={`text-6xl md:text-7xl font-black tracking-tighter ${styles.text} font-mono transition-colors duration-500`}>
        {currentPhase === 'finished' ? '00:00' : formatTime(timeRemaining)}
      </span>
    </div>
  );
}
