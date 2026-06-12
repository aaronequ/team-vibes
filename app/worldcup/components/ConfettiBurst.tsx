"use client";

import { useEffect, useRef } from "react";

const CONFETTI_COLORS = [
  "#46c2ac",
  "#f58a8d",
  "#e31e36",
  "#ffd166",
  "#4ecdc4",
  "#ff6b6b",
  "#9b59b6",
  "#3498db",
  "#f39c12",
  "#2ecc71",
];

const PARTICLE_COUNT = 48;
const DURATION_MS = 2200;
const GRAVITY = 720;

type Shape = "circle" | "square" | "triangle";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  shape: Shape;
  size: number;
  rotation: number;
  rotationSpeed: number;
}

interface ConfettiBurstProps {
  originX: number;
  originY: number;
  onDone: () => void;
}

function createParticles(originX: number, originY: number): Particle[] {
  const shapes: Shape[] = ["circle", "square", "triangle"];

  return Array.from({ length: PARTICLE_COUNT }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 180 + Math.random() * 320;
    return {
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 120,
      color:
        CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      size: 6 + Math.random() * 8,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 720,
    };
  });
}

function applyShape(el: HTMLDivElement, particle: Particle): void {
  el.className = "confetti-piece absolute pointer-events-none";
  el.style.width = `${particle.size}px`;
  el.style.height = `${particle.size}px`;
  el.style.transform = `translate(${particle.x}px, ${particle.y}px) rotate(${particle.rotation}deg)`;

  if (particle.shape === "circle") {
    el.style.borderRadius = "9999px";
    el.style.backgroundColor = particle.color;
  } else if (particle.shape === "square") {
    el.style.backgroundColor = particle.color;
  } else {
    el.style.width = "0";
    el.style.height = "0";
    el.style.backgroundColor = "transparent";
    el.style.borderLeft = `${particle.size / 2}px solid transparent`;
    el.style.borderRight = `${particle.size / 2}px solid transparent`;
    el.style.borderBottom = `${particle.size}px solid ${particle.color}`;
  }
}

export function ConfettiBurst({ originX, originY, onDone }: ConfettiBurstProps) {
  const layerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    const particles = createParticles(originX, originY);
    const nodes = particles.map((particle) => {
      const el = document.createElement("div");
      applyShape(el, particle);
      layer.appendChild(el);
      return { el, particle };
    });

    const step = (time: number) => {
      if (!startTimeRef.current) startTimeRef.current = time;
      if (!lastTimeRef.current) lastTimeRef.current = time;

      const elapsed = time - startTimeRef.current;
      if (elapsed >= DURATION_MS) {
        onDoneRef.current();
        return;
      }

      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.032);
      lastTimeRef.current = time;
      const fade =
        elapsed > DURATION_MS * 0.65
          ? 1 - (elapsed - DURATION_MS * 0.65) / (DURATION_MS * 0.35)
          : 1;

      for (const { el, particle } of nodes) {
        particle.vy += GRAVITY * dt;
        particle.x += particle.vx * dt;
        particle.y += particle.vy * dt;
        particle.rotation += particle.rotationSpeed * dt;

        el.style.transform = `translate(${particle.x}px, ${particle.y}px) rotate(${particle.rotation}deg)`;
        el.style.opacity = String(Math.max(0, fade));
      }

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rafRef.current);
      startTimeRef.current = 0;
      lastTimeRef.current = 0;
      nodes.forEach(({ el }) => el.remove());
    };
  }, [originX, originY]);

  return (
    <div
      ref={layerRef}
      className="fixed inset-0 pointer-events-none z-[60] overflow-hidden"
      aria-hidden
    />
  );
}
