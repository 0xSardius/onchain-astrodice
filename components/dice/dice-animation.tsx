"use client";

import { useEffect, useState } from "react";
import { PLANETS, SIGNS, HOUSES } from "@/lib/astrodice";

interface DiceAnimationProps {
  isRolling: boolean;
  duration?: number;
}

export function DiceAnimation({
  isRolling,
  duration = 2000,
}: DiceAnimationProps) {
  const [currentPlanet, setCurrentPlanet] = useState(PLANETS[0]);
  const [currentSign, setCurrentSign] = useState(SIGNS[0]);
  const [currentHouse, setCurrentHouse] = useState(HOUSES[0]);

  useEffect(() => {
    if (!isRolling) return;

    // Rapidly cycle through options during animation
    const interval = setInterval(() => {
      setCurrentPlanet(PLANETS[Math.floor(Math.random() * PLANETS.length)]);
      setCurrentSign(SIGNS[Math.floor(Math.random() * SIGNS.length)]);
      setCurrentHouse(HOUSES[Math.floor(Math.random() * HOUSES.length)]);
    }, 80);

    return () => clearInterval(interval);
  }, [isRolling]);

  if (!isRolling) return null;

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-8">
      {/* Spinning dice visualization */}
      <div className="flex items-center justify-center gap-4">
        {/* Planet die */}
        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30 flex items-center justify-center animate-bounce">
          <span className="text-3xl">{currentPlanet.symbol}</span>
        </div>

        {/* Sign die */}
        <div
          className="w-20 h-20 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 border border-purple-500/30 flex items-center justify-center animate-bounce"
          style={{ animationDelay: "0.1s" }}
        >
          <span className="text-3xl">{currentSign.symbol}</span>
        </div>

        {/* House die */}
        <div
          className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-600/20 border border-blue-500/30 flex items-center justify-center animate-bounce"
          style={{ animationDelay: "0.2s" }}
        >
          <span className="text-2xl font-bold text-blue-300">
            {currentHouse.number}
          </span>
        </div>
      </div>

      {/* Loading text */}
      <div className="text-white/60 text-sm animate-pulse">
        Consulting the cosmos...
      </div>
    </div>
  );
}
