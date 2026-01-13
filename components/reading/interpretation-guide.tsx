"use client";

import { useState } from "react";
import type { AstrodiceRoll } from "@/lib/astrodice";
import { getPlanetInfo, getSignInfo, getHouseInfo } from "@/lib/astrodice";

interface InterpretationGuideProps {
  roll: AstrodiceRoll;
}

export function InterpretationGuide({ roll }: InterpretationGuideProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const planet = getPlanetInfo(roll.planet);
  const sign = getSignInfo(roll.sign);
  const house = getHouseInfo(roll.house);

  return (
    <div className="w-full">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
      >
        <span className="text-sm text-white/70">
          {isExpanded ? "Hide" : "See"} Interpretation Guide
        </span>
        <span
          className={`text-white/50 transition-transform ${isExpanded ? "rotate-180" : ""}`}
        >
          &#x25BC;
        </span>
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4 p-4 rounded-xl bg-white/5 border border-white/10">
          <p className="text-xs text-white/50 text-center mb-4">
            Use this guide to interpret your roll yourself, or get an AI reading
            for a personalized synthesis.
          </p>

          {/* Planet meaning */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">{planet.symbol}</span>
              <span className="text-sm font-medium text-amber-400">
                {planet.name}
              </span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              {planet.meaning}
            </p>
          </div>

          <div className="border-t border-white/10" />

          {/* Sign meaning */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">{sign.symbol}</span>
              <span className="text-sm font-medium text-purple-400">
                {sign.name}
              </span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              {sign.meaning}
            </p>
          </div>

          <div className="border-t border-white/10" />

          {/* House meaning */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-lg font-serif text-blue-400">
                {house.number}
              </span>
              <span className="text-sm font-medium text-blue-400">
                {house.name}
              </span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              {house.meaning}
            </p>
          </div>

          <div className="border-t border-white/10" />

          {/* Synthesis hint */}
          <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-lg p-3">
            <p className="text-xs text-white/60 leading-relaxed">
              <strong className="text-white/80">To interpret:</strong> Consider
              how the energy of {planet.name} ({planet.keywords[0].toLowerCase()}
              ) expresses through {sign.name}&apos;s style (
              {sign.keywords[0].toLowerCase()}) in the domain of{" "}
              {house.name.toLowerCase()} ({house.keywords[0].toLowerCase()}).
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
