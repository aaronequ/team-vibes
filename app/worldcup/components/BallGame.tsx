"use client";

import { useState } from "react";
import { GrassStrip } from "./GrassStrip";
import { SoccerBallPhysics } from "./SoccerBallPhysics";

export function BallGame() {
  const [spawnKey, setSpawnKey] = useState(0);
  const ballActive = spawnKey > 0;

  return (
    <>
      <div className="p-5 pt-0 mt-auto">
        <button
          type="button"
          onClick={() => setSpawnKey((key) => key + 1)}
          className="w-full rounded-md border border-equ-teal/40 bg-equ-teal/10 px-3 py-2 text-sm font-medium text-equ-teal transition-colors hover:bg-equ-teal/20 focus:outline-none focus:ring-2 focus:ring-equ-teal focus:ring-offset-2 focus:ring-offset-equ-dark-2"
        >
          Drop ball
        </button>
      </div>

      {ballActive && <GrassStrip />}
      {ballActive && <SoccerBallPhysics key={spawnKey} />}
    </>
  );
}
