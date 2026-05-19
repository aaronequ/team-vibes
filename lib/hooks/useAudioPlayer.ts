import { useEffect, useRef, useState, useCallback } from 'react';

// Selected tracks for perfect training ambiance
const WORK_VIDEO_ID = 'btPJPFnesV4'; // Survivor - Eye of the Tiger
const REST_VIDEO_ID = 'JFgT3GOPQic'; // Relaxing Ambient Piano Music

export function useAudioPlayer() {
  const playerRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  const [isReady, setIsReady] = useState(false);
  const [currentTrackName, setCurrentTrackName] = useState<string>('Ready');

  // Fallback beep generator using Web Audio API
  const playFallbackBeep = useCallback((freq: number, duration: number) => {
    try {
      if (typeof window === 'undefined') return;
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('Fallback beep failed', e);
    }
  }, []);

  const initAudio = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Load YouTube API script if not loaded
    if (!(window as any).YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      (window as any).onYouTubeIframeAPIReady = () => {
        createPlayer();
      };
    } else {
      createPlayer();
    }

    function createPlayer() {
      if (playerRef.current) return;

      const container = document.getElementById('youtube-player-container');
      if (!container) {
        console.warn('youtube-player-container not yet rendered in DOM');
        return;
      }

      playerRef.current = new (window as any).YT.Player('youtube-player-container', {
        height: '100%',
        width: '100%',
        videoId: WORK_VIDEO_ID,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
        },
        events: {
          onReady: () => {
            setIsReady(true);
            console.log('YouTube active mini-player is loaded.');
          },
          onError: (e: any) => {
            console.error('YouTube player error, utilizing local audio backup', e);
            playFallbackBeep(220, 0.4);
          }
        }
      });
    }
  }, [playFallbackBeep]);

  // Handle lazy loading after mount
  useEffect(() => {
    const timer = setTimeout(() => {
      initAudio();
    }, 800); // brief delay to guarantee the container exists in the HTML DOM
    return () => clearTimeout(timer);
  }, [initAudio]);

  const playHighIntensity = useCallback(() => {
    initAudio();
    setCurrentTrackName('Survivor - Eye of the Tiger');
    
    if (playerRef.current && typeof playerRef.current.loadVideoById === 'function') {
      try {
        playerRef.current.loadVideoById({
          videoId: WORK_VIDEO_ID,
          startSeconds: 0,
        });
        playerRef.current.playVideo();
      } catch (e) {
        console.warn('YT direct play failed, using beep', e);
        playFallbackBeep(440, 0.5);
      }
    } else {
      playFallbackBeep(440, 0.5);
    }
  }, [initAudio, playFallbackBeep]);

  const playRelaxing = useCallback(() => {
    initAudio();
    setCurrentTrackName('Ambient Relaxing Piano');
    
    if (playerRef.current && typeof playerRef.current.loadVideoById === 'function') {
      try {
        playerRef.current.loadVideoById({
          videoId: REST_VIDEO_ID,
          startSeconds: 0,
        });
        playerRef.current.playVideo();
      } catch (e) {
        console.warn('YT direct play failed, using beep', e);
        playFallbackBeep(330, 0.5);
      }
    } else {
      playFallbackBeep(330, 0.5);
    }
  }, [initAudio, playFallbackBeep]);

  const stopAll = useCallback(() => {
    setCurrentTrackName('Paused');
    if (playerRef.current && typeof playerRef.current.pauseVideo === 'function') {
      try {
        playerRef.current.pauseVideo();
      } catch (e) {
        console.warn('YT pause failed', e);
      }
    }
  }, []);

  return { playHighIntensity, playRelaxing, stopAll, initAudio, playFallbackBeep, currentTrackName, isReady };
}
