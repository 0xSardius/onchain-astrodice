"use client";

import type { AstrodiceRoll } from "@/lib/astrodice";
import { getPlanetInfo, getSignInfo, getHouseInfo } from "@/lib/astrodice";

interface DiceResultProps {
  roll: AstrodiceRoll;
  question: string;
}

export function DiceResult({ roll, question }: DiceResultProps) {
  const planet = getPlanetInfo(roll.planet);
  const sign = getSignInfo(roll.sign);
  const house = getHouseInfo(roll.house);

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Question reminder */}
      <div className="text-center">
        <p className="text-white/50 text-xs uppercase tracking-wider mb-1">
          You asked
        </p>
        <p className="text-white/80 text-sm italic">&ldquo;{question}&rdquo;</p>
      </div>

      {/* Main result display */}
      <div className="bg-white/5 rounded-2xl border border-white/10 p-6 space-y-6">
        {/* Symbols row */}
        <div className="flex items-center justify-center gap-3 text-4xl">
          <span title={planet.name}>{planet.symbol}</span>
          <span className="text-white/30">·</span>
          <span title={sign.name}>{sign.symbol}</span>
          <span className="text-white/30">·</span>
          <span className="font-serif" title={`${house.number}th House`}>
            {house.number}
          </span>
        </div>

        {/* Names row */}
        <div className="text-center">
          <p className="text-lg font-medium text-white">
            {planet.name} in {sign.name}
          </p>
          <p className="text-white/60">{house.name}</p>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10" />

        {/* Planet section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{planet.symbol}</span>
            <span className="text-sm font-medium text-amber-400">
              {planet.name}
            </span>
            <span className="text-xs text-white/40">
              — What energy is present
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {planet.keywords.map((kw) => (
              <span
                key={kw}
                className="px-2 py-0.5 text-xs rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>

        {/* Sign section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{sign.symbol}</span>
            <span className="text-sm font-medium text-purple-400">
              {sign.name}
            </span>
            <span className="text-xs text-white/40">— How it manifests</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {sign.keywords.map((kw) => (
              <span
                key={kw}
                className="px-2 py-0.5 text-xs rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20"
              >
                {kw}
              </span>
            ))}
          </div>
          <div className="flex gap-2 text-xs text-white/40">
            <span>{sign.element}</span>
            <span>·</span>
            <span>{sign.modality}</span>
          </div>
        </div>

        {/* House section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xl font-serif text-blue-400">
              {house.number}
            </span>
            <span className="text-sm font-medium text-blue-400">
              {house.name}
            </span>
            <span className="text-xs text-white/40">— Where in your life</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {house.keywords.map((kw) => (
              <span
                key={kw}
                className="px-2 py-0.5 text-xs rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
