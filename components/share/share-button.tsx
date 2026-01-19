"use client";

import { useState } from "react";
import { composeCast } from "@/lib/farcaster/auth";
import { getPlanetInfo, getSignInfo, getHouseInfo } from "@/lib/astrodice";
import type { AstrodiceRoll } from "@/lib/astrodice";

interface ShareButtonProps {
  roll: AstrodiceRoll;
  question: string;
  readingId?: number;
  isMinted?: boolean;
  className?: string;
}

function generateShareText(roll: AstrodiceRoll, question: string): string {
  const planet = getPlanetInfo(roll.planet);
  const sign = getSignInfo(roll.sign);
  const house = getHouseInfo(roll.house);

  const lines = [
    `${planet.symbol} ${planet.name} in ${sign.symbol} ${sign.name}`,
    `${house.name}`,
    "",
    `"${question.length > 100 ? question.slice(0, 97) + "..." : question}"`,
    "",
    "Cast your own cosmic dice",
  ];

  return lines.join("\n");
}

export function ShareButton({
  roll,
  question,
  isMinted = false,
  className = "",
}: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [shared, setShared] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);

    try {
      const text = generateShareText(roll, question);

      // Include app URL as embed
      const appUrl = typeof window !== "undefined"
        ? window.location.origin
        : "https://onchain-astrodice.vercel.app";

      await composeCast(text, appUrl);
      setShared(true);
    } catch (err) {
      console.error("Share failed:", err);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <button
      onClick={handleShare}
      disabled={isSharing}
      className={`py-3 px-4 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 text-sm hover:bg-purple-600/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isSharing ? (
        "Opening..."
      ) : shared ? (
        <>
          <span className="mr-1">&#x2714;</span> Shared
        </>
      ) : (
        <>
          <span className="mr-1">&#x1F4E4;</span> Share{isMinted ? " NFT" : ""}
        </>
      )}
    </button>
  );
}
