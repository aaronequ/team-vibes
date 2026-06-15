"use client";

import { useState } from "react";
import { createPortal } from "react-dom";

import { GrassStrip } from "./GrassStrip";
import { SoccerBallPhysics } from "./SoccerBallPhysics";

export function BallGame() {
  const [active, setActive] = useState(false);
  const [spawnKey, setSpawnKey] = useState(0);

  const handleClick = () => {
    if (active) {
      // "Kick ball" — clear the ball and grass away.
      setActive(false);
    } else {
      // "Drop ball" — spawn a fresh ball (new key resets the physics).
      setSpawnKey((key) => key + 1);
      setActive(true);
    }
  };

  return (
    <>
      <div className="p-5 pt-0 mt-auto">
        <button
          type="button"
          onClick={handleClick}
          className="w-full rounded-md border border-equ-teal/40 bg-equ-teal/10 px-3 py-2 text-sm font-medium text-equ-teal transition-colors hover:bg-equ-teal/20 focus:outline-none focus:ring-2 focus:ring-equ-teal focus:ring-offset-2 focus:ring-offset-equ-dark-2"
        >
          {active ? "Kick ball" : "Drop ball"}
        </button>
      </div>

      {/*
        Portal to <body> so the ball escapes the sidebar's `z-10` stacking
        context and renders on top of everything — without it, <main> paints
        over the ball and also swallows the clicks meant for it.
      */}
      {active &&
        createPortal(
          <>
            <GrassStrip />
            <SoccerBallPhysics key={spawnKey} />
          </>,
          document.body,
        )}
    </>
  );
}
