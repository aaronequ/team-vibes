import { useState, useEffect, useCallback, useRef } from 'react';
import { useAudioPlayer } from './useAudioPlayer';

export type Phase = 'idle' | 'work' | 'rest' | 'long_rest' | 'finished';

export function useFitnessTimer() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentBank, setCurrentBank] = useState(1);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentPhase, setCurrentPhase] = useState<Phase>('idle');
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [quote, setQuote] = useState('');

  const { playHighIntensity, playRelaxing, stopAll, initAudio, playFallbackBeep, currentTrackName, isReady } = useAudioPlayer();
  const timeRemainingRef = useRef(timeRemaining);

  useEffect(() => {
    timeRemainingRef.current = timeRemaining;
  }, [timeRemaining]);

  const WORK_TIME = 30;
  const REST_TIME = 10;
  const LONG_REST_TIME = 60;
  const TOTAL_ROUNDS = 10;
  const TOTAL_BANKS = 4;

  const speak = useCallback((text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel(); // cancel any active speech immediately
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.25; // count down briskly
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const fetchQuote = async () => {
    try {
      const res = await fetch('/api/quote');
      const data = await res.json();
      setQuote(data.quote);
    } catch (e) {
      setQuote('Keep pushing! You are stronger than you think. The pain you feel today is the strength you feel tomorrow.');
    }
  };

  const advancePhase = useCallback(() => {
    if (currentPhase === 'work') {
      if (currentRound < TOTAL_ROUNDS) {
        setCurrentPhase('rest');
        setTimeRemaining(REST_TIME);
        playRelaxing();
        speak('Rest');
      } else {
        if (currentBank < TOTAL_BANKS) {
          setCurrentPhase('long_rest');
          setTimeRemaining(LONG_REST_TIME);
          stopAll();
          setQuote('Loading inspiration...');
          fetchQuote();
          speak('Extended rest');
        } else {
          setCurrentPhase('finished');
          setIsRunning(false);
          stopAll();
          speak('Workout complete. Fantastic job!');
        }
      }
    } else if (currentPhase === 'rest') {
      setCurrentRound((prev) => prev + 1);
      setCurrentPhase('work');
      setTimeRemaining(WORK_TIME);
      playHighIntensity();
      speak("Let's go");
    } else if (currentPhase === 'long_rest') {
      setCurrentBank((prev) => prev + 1);
      setCurrentRound(1);
      setCurrentPhase('work');
      setTimeRemaining(WORK_TIME);
      playHighIntensity();
      speak("Let's go");
    }
  }, [currentPhase, currentRound, currentBank, playHighIntensity, playRelaxing, stopAll, speak, TOTAL_ROUNDS, TOTAL_BANKS]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        if (timeRemainingRef.current > 0) {
          const nextTime = timeRemainingRef.current - 1;
          setTimeRemaining(nextTime);

          // Voice countdown for the last 3 seconds of work, rest, or long rest phase
          if ((currentPhase === 'work' || currentPhase === 'rest' || currentPhase === 'long_rest') && nextTime <= 3 && nextTime >= 1) {
            speak(nextTime.toString());
          }
          // Highlight beep in case audio doesn't play
          if (currentPhase === 'work' && nextTime === 0) {
            playFallbackBeep(880, 0.3); // sharp ending beep
          }
        } else {
          advancePhase();
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, currentPhase, advancePhase, speak, playFallbackBeep]);

  const start = () => {
    // Initialize audio directly inside the user action thread
    initAudio();
    
    if (currentPhase === 'idle' || currentPhase === 'finished') {
      setCurrentBank(1);
      setCurrentRound(1);
      setCurrentPhase('work');
      setTimeRemaining(WORK_TIME);
      playHighIntensity();
      speak('Starting workout. Work!');
    } else {
       if (currentPhase === 'work') playHighIntensity();
       if (currentPhase === 'rest') playRelaxing();
    }
    setIsRunning(true);
  };

  const pause = () => {
    setIsRunning(false);
    stopAll();
  };

  const reset = () => {
    setIsRunning(false);
    setCurrentBank(1);
    setCurrentRound(1);
    setCurrentPhase('idle');
    setTimeRemaining(WORK_TIME);
    stopAll();
    setQuote('');
  };

  return {
    isRunning,
    currentBank,
    currentRound,
    currentPhase,
    timeRemaining,
    quote,
    currentTrackName,
    isReady,
    start,
    pause,
    reset,
    TOTAL_BANKS,
    TOTAL_ROUNDS
  };
}
