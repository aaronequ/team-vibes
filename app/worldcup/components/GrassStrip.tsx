"use client";

import { useId } from "react";

type BladeSpec = {
  x: number;
  h: number;
  lean: number;
  w: number;
  fill: string;
  stroke: string;
};

const BLADE_FILLS = [
  "#4ade80",
  "#22c55e",
  "#16a34a",
  "#86efac",
  "#15803d",
] as const;
const BLADE_STROKE = "#14532d";

function bladePath(x: number, h: number, lean: number, w: number): string {
  const tipX = x + lean;
  const tipY = -h;
  const midL = x - w * 0.35 + lean * 0.25;
  const midR = x + w * 0.35 + lean * 0.25;
  const midY = -h * 0.55;

  return `M ${x} 0 Q ${midL} ${midY} ${tipX} ${tipY} Q ${midR} ${midY} ${x} 0 Z`;
}

function GrassBlade({ x, h, lean, w, fill, stroke }: BladeSpec) {
  return (
    <path
      d={bladePath(x, h, lean, w)}
      fill={fill}
      stroke={stroke}
      strokeWidth="1"
      strokeLinejoin="round"
    />
  );
}

const PATTERN_BLADES: BladeSpec[] = [
  { x: 2, h: 17, lean: -3, w: 3.2, fill: BLADE_FILLS[0], stroke: BLADE_STROKE },
  { x: 6, h: 24, lean: 5, w: 2.8, fill: BLADE_FILLS[2], stroke: BLADE_STROKE },
  { x: 10, h: 14, lean: -6, w: 2.4, fill: BLADE_FILLS[1], stroke: BLADE_STROKE },
  { x: 14, h: 26, lean: 2, w: 3.4, fill: BLADE_FILLS[3], stroke: BLADE_STROKE },
  { x: 18, h: 19, lean: -4, w: 2.6, fill: BLADE_FILLS[4], stroke: BLADE_STROKE },
  { x: 22, h: 22, lean: 7, w: 3, fill: BLADE_FILLS[0], stroke: BLADE_STROKE },
  { x: 26, h: 15, lean: -2, w: 2.2, fill: BLADE_FILLS[1], stroke: BLADE_STROKE },
  { x: 30, h: 28, lean: -5, w: 3.6, fill: BLADE_FILLS[2], stroke: BLADE_STROKE },
  { x: 34, h: 18, lean: 4, w: 2.5, fill: BLADE_FILLS[3], stroke: BLADE_STROKE },
  { x: 38, h: 21, lean: -8, w: 2.8, fill: BLADE_FILLS[4], stroke: BLADE_STROKE },
  { x: 42, h: 16, lean: 3, w: 2.3, fill: BLADE_FILLS[0], stroke: BLADE_STROKE },
  { x: 46, h: 25, lean: 6, w: 3.2, fill: BLADE_FILLS[1], stroke: BLADE_STROKE },
];

const FOREGROUND_BLADES: BladeSpec[] = [
  { x: 4, h: 11, lean: 4, w: 2, fill: BLADE_FILLS[3], stroke: BLADE_STROKE },
  { x: 12, h: 13, lean: -5, w: 2.2, fill: BLADE_FILLS[0], stroke: BLADE_STROKE },
  { x: 20, h: 9, lean: 3, w: 1.8, fill: BLADE_FILLS[1], stroke: BLADE_STROKE },
  { x: 28, h: 12, lean: -4, w: 2.1, fill: BLADE_FILLS[2], stroke: BLADE_STROKE },
  { x: 36, h: 10, lean: 6, w: 1.9, fill: BLADE_FILLS[4], stroke: BLADE_STROKE },
  { x: 44, h: 14, lean: -3, w: 2.3, fill: BLADE_FILLS[3], stroke: BLADE_STROKE },
];

function BladeLayer({
  blades,
  offsetY,
}: {
  blades: BladeSpec[];
  offsetY: number;
}) {
  return (
    <g transform={`translate(0, ${offsetY})`}>
      {blades.map((blade) => (
        <GrassBlade key={`${blade.x}-${blade.h}-${blade.lean}`} {...blade} />
      ))}
    </g>
  );
}

const STRIP_HEIGHT = 40;
const FLAT_TOP = 11;

export function GrassStrip() {
  const patternId = useId();
  const foregroundPatternId = useId();
  const clipId = useId();

  return (
    <div
      className="grass-strip pointer-events-none fixed inset-x-0 bottom-0 z-0 h-[2.5rem]"
      aria-hidden
    >
      <svg
        className="block h-full w-full"
        preserveAspectRatio="none"
        viewBox={`0 0 1200 ${STRIP_HEIGHT}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id={clipId}>
            <rect
              x="0"
              y={FLAT_TOP}
              width="1200"
              height={STRIP_HEIGHT - FLAT_TOP}
            />
          </clipPath>
          <pattern
            id={patternId}
            patternUnits="userSpaceOnUse"
            width="48"
            height={STRIP_HEIGHT}
          >
            <BladeLayer blades={PATTERN_BLADES} offsetY={STRIP_HEIGHT} />
          </pattern>
          <pattern
            id={foregroundPatternId}
            patternUnits="userSpaceOnUse"
            width="48"
            height={STRIP_HEIGHT}
          >
            <BladeLayer blades={FOREGROUND_BLADES} offsetY={STRIP_HEIGHT} />
          </pattern>
        </defs>

        <rect
          y={FLAT_TOP}
          width="1200"
          height={STRIP_HEIGHT - FLAT_TOP}
          fill="#166534"
        />
        <g clipPath={`url(#${clipId})`}>
          <rect
            y={FLAT_TOP}
            width="1200"
            height={STRIP_HEIGHT - FLAT_TOP}
            fill={`url(#${patternId})`}
          />
          <rect
            y={FLAT_TOP}
            width="1200"
            height={STRIP_HEIGHT - FLAT_TOP}
            fill={`url(#${foregroundPatternId})`}
            opacity="0.92"
          />
        </g>
        <line
          x1="0"
          y1={FLAT_TOP}
          x2="1200"
          y2={FLAT_TOP}
          stroke="#14532d"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}
