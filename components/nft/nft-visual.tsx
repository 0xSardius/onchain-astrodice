"use client";

import { useMemo } from "react";
import type { AstrodiceRoll } from "@/lib/astrodice";
import { generateNftSvg } from "@/lib/nft";

interface NftVisualProps {
  roll: AstrodiceRoll;
  question: string;
  username: string;
  timestamp: Date;
  hasAiReading: boolean;
  className?: string;
}

export function NftVisual({
  roll,
  question,
  username,
  timestamp,
  hasAiReading,
  className = "",
}: NftVisualProps) {
  // Generate SVG string - memoized for performance
  const svgString = useMemo(() => {
    return generateNftSvg({
      roll,
      question,
      username,
      timestamp,
      hasAiReading,
    });
  }, [roll, question, username, timestamp, hasAiReading]);

  // Render as inline SVG using dangerouslySetInnerHTML
  // This is safe because we control the SVG generation
  return (
    <div
      className={`nft-visual aspect-square ${className}`}
      dangerouslySetInnerHTML={{ __html: svgString }}
    />
  );
}
