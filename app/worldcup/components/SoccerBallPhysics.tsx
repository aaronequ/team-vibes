"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ConfettiBurst } from "./ConfettiBurst";

const BALL_SIZE = 88;
const GRAVITY = 1980;
const RESTITUTION = 0.72;
const GROUND_FRICTION = 0.94;
const ROLLING_DECELERATION = 360;
const WALL_RESTITUTION = 0.65;
const MIN_ROLLING_VELOCITY = 12;
const CLICK_IMPULSE = 520;
const MIN_BOUNCE_VELOCITY = 80;
const LAUNCH_VY_THRESHOLD = -40;
const REACTION_FADE_MS = 1000;

interface PhysicsState {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface ConfettiBurstState {
  id: number;
  x: number;
  y: number;
}

function randomSpawnX(): number {
  const margin = BALL_SIZE;
  const max = Math.max(margin, window.innerWidth - margin);
  return margin + Math.random() * (max - margin);
}

function isGrounded(s: PhysicsState, floor: number): boolean {
  return s.y >= floor - 1 && Math.abs(s.vy) < MIN_BOUNCE_VELOCITY * 2;
}

function ballCenter(s: PhysicsState): { x: number; y: number } {
  return { x: s.x + BALL_SIZE / 2, y: s.y + BALL_SIZE / 2 };
}

export function SoccerBallPhysics() {
  const ballRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<PhysicsState>({
    x: 0,
    y: -BALL_SIZE,
    vx: 0,
    vy: 0,
  });
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const juggleCountRef = useRef(0);
  const reactionTimeoutRef = useRef<number>(0);
  const confettiIdRef = useRef(0);

  const [juggleCount, setJuggleCount] = useState(0);
  const [showReaction, setShowReaction] = useState(false);
  const [reactionFace, setReactionFace] = useState<"happy" | "sad">("sad");
  const [reactionKey, setReactionKey] = useState(0);
  const [confettiBursts, setConfettiBursts] = useState<ConfettiBurstState[]>(
    [],
  );

  const spawnConfetti = useCallback((count: number) => {
    if (count <= 0 || count % 10 !== 0) return;
    const center = ballCenter(stateRef.current);
    confettiIdRef.current += 1;
    setConfettiBursts((bursts) => [
      ...bursts,
      { id: confettiIdRef.current, x: center.x, y: center.y },
    ]);
  }, []);

  useEffect(() => {
    const ball = ballRef.current;
    if (!ball) return;

    juggleCountRef.current = 0;
    stateRef.current = {
      x: randomSpawnX(),
      y: -BALL_SIZE,
      vx: (Math.random() - 0.5) * 120,
      vy: 0,
    };

    const applyTransform = (s: PhysicsState) => {
      ball.style.transform = `translate(${s.x}px, ${s.y}px)`;
    };

    applyTransform(stateRef.current);

    const triggerLandingReaction = (landingCount: number) => {
      juggleCountRef.current = 0;
      setJuggleCount(0);
      setReactionFace(landingCount >= 10 ? "happy" : "sad");
      setReactionKey((key) => key + 1);
      setShowReaction(true);
      window.clearTimeout(reactionTimeoutRef.current);
      reactionTimeoutRef.current = window.setTimeout(
        () => setShowReaction(false),
        REACTION_FADE_MS,
      );
    };

    const step = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.032);
      lastTimeRef.current = time;

      const s = stateRef.current;
      const floor = window.innerHeight - BALL_SIZE;
      const maxX = window.innerWidth - BALL_SIZE;
      const prevY = s.y;
      const prevVy = s.vy;

      s.vy += GRAVITY * dt;
      s.x += s.vx * dt;
      s.y += s.vy * dt;

      if (s.y >= floor) {
        const landingCount = juggleCountRef.current;
        if (landingCount >= 1 && prevY < floor && prevVy > 0) {
          triggerLandingReaction(landingCount);
        }

        s.y = floor;
        if (Math.abs(s.vy) > MIN_BOUNCE_VELOCITY) {
          s.vy = -s.vy * RESTITUTION;
          s.vx *= GROUND_FRICTION;
        } else {
          s.vy = 0;
          const decel = ROLLING_DECELERATION * dt;
          if (Math.abs(s.vx) <= decel) {
            s.vx = 0;
          } else {
            s.vx -= Math.sign(s.vx) * decel;
          }
        }
      }

      if (s.y >= floor && Math.abs(s.vx) < MIN_ROLLING_VELOCITY && s.vy === 0) {
        s.vx = 0;
      }

      if (s.x <= 0) {
        s.x = 0;
        s.vx = Math.abs(s.vx) * WALL_RESTITUTION;
      } else if (s.x >= maxX) {
        s.x = maxX;
        s.vx = -Math.abs(s.vx) * WALL_RESTITUTION;
      }

      applyTransform(s);
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.clearTimeout(reactionTimeoutRef.current);
      lastTimeRef.current = 0;
    };
  }, []);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const ball = ballRef.current;
    if (!ball) return;

    const floor = window.innerHeight - BALL_SIZE;
    const s = stateRef.current;
    const grounded = isGrounded(s, floor);

    const rect = ball.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;

    // Always launch upward so every click keeps the ball in the air
    // (keepy-uppy); where you strike it horizontally steers it left/right.
    const dx = centerX - event.clientX;
    const horizontal = Math.max(-1, Math.min(1, dx / (BALL_SIZE / 2)));

    s.vx = horizontal * CLICK_IMPULSE * 0.5;
    s.vy = -CLICK_IMPULSE;

    let newCount = juggleCountRef.current;

    if (grounded) {
      if (s.vy < LAUNCH_VY_THRESHOLD) {
        newCount = 1;
      }
    } else {
      newCount += 1;
    }

    juggleCountRef.current = newCount;
    setJuggleCount(newCount);
    spawnConfetti(newCount);
  };

  return (
    <>
      {confettiBursts.map((burst) => (
        <ConfettiBurst
          key={burst.id}
          originX={burst.x}
          originY={burst.y}
          onDone={() =>
            setConfettiBursts((bursts) =>
              bursts.filter((b) => b.id !== burst.id),
            )
          }
        />
      ))}

      <div className="fixed inset-0 pointer-events-none z-50" aria-hidden>
        <div
          ref={ballRef}
          role="presentation"
          onPointerDown={handlePointerDown}
          className="soccer-ball-interactive pointer-events-auto absolute left-0 top-0 cursor-pointer touch-none"
          style={{ width: BALL_SIZE, height: BALL_SIZE }}
        >
          {juggleCount > 0 && (
            <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-equ-dark pointer-events-none select-none">
              {juggleCount}
            </span>
          )}
          {showReaction && (
            <span
              key={reactionKey}
              className="soccer-ball-reaction-face absolute inset-0 flex items-center justify-center text-5xl leading-none pointer-events-none select-none"
              aria-hidden
            >
              {reactionFace === "happy" ? "😄" : "😢"}
            </span>
          )}
        </div>
      </div>
    </>
  );
}
