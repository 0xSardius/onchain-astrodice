// Compose final NFT SVG from planet colors, sign patterns, house glyphs
import type { AstrodiceRoll } from "@/lib/astrodice";
import { getPlanetInfo, getSignInfo, getHouseInfo } from "@/lib/astrodice";
import { getPlanetColors } from "./colors";
import { getSignPattern } from "./patterns";
import { getHouseGlyph } from "./glyphs";

export interface NftVisualConfig {
  roll: AstrodiceRoll;
  question: string;
  username: string;
  timestamp: Date;
  hasAiReading: boolean;
}

function getOrdinalSuffix(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function generateNftSvg(config: NftVisualConfig): string {
  const { roll, question, username, timestamp, hasAiReading } = config;

  const colors = getPlanetColors(roll.planet);
  const pattern = getSignPattern(roll.sign);
  const glyph = getHouseGlyph(roll.house);

  const planetInfo = getPlanetInfo(roll.planet);
  const signInfo = getSignInfo(roll.sign);
  const houseInfo = getHouseInfo(roll.house);

  const dateStr = timestamp.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Truncate question for display
  const displayQuestion =
    question.length > 50 ? question.slice(0, 47) + "..." : question;

  // Typography treatment based on AI reading purchase
  const fontFamily = hasAiReading
    ? "'Georgia', 'Times New Roman', serif" // Ornate
    : "'Arial', 'Helvetica', sans-serif"; // Standard

  const titleWeight = hasAiReading ? "normal" : "bold";

  // Get short house name (first part before &)
  const shortHouseName = houseInfo.name.split(" & ")[0];

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${colors.primary}" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="${colors.secondary}" stop-opacity="0.95"/>
    </linearGradient>

    <pattern id="stars" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
      <circle cx="10" cy="10" r="0.5" fill="${colors.accent}" opacity="0.6"/>
      <circle cx="35" cy="20" r="0.3" fill="${colors.accent}" opacity="0.4"/>
      <circle cx="25" cy="40" r="0.4" fill="${colors.accent}" opacity="0.5"/>
      <circle cx="45" cy="5" r="0.3" fill="${colors.accent}" opacity="0.3"/>
      <circle cx="5" cy="30" r="0.4" fill="${colors.accent}" opacity="0.5"/>
    </pattern>

    <pattern id="borderPattern" x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
      <path d="${pattern.pathD}" stroke="${colors.accent}" stroke-width="${pattern.strokeWidth}" fill="none" opacity="0.7"/>
    </pattern>

    <filter id="glow">
      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <rect width="400" height="400" fill="url(#bgGradient)"/>
  <rect width="400" height="400" fill="url(#stars)"/>

  <rect x="10" y="10" width="380" height="380" fill="none" stroke="url(#borderPattern)" stroke-width="20" rx="10"/>

  <rect x="30" y="30" width="340" height="340" fill="rgba(0,0,0,0.3)" rx="8"/>

  <text x="200" y="70" text-anchor="middle" font-family="${fontFamily}" font-size="20" font-weight="${titleWeight}" fill="${colors.accent}" filter="url(#glow)">
    ${planetInfo.symbol} ${escapeXml(roll.planet)} in ${signInfo.symbol} ${escapeXml(roll.sign)}
  </text>

  <text x="200" y="95" text-anchor="middle" font-family="${fontFamily}" font-size="14" fill="${colors.accent}" opacity="0.85">
    ${roll.house}${getOrdinalSuffix(roll.house)} House - ${escapeXml(shortHouseName)}
  </text>

  <g transform="translate(150, 120)">
    <path d="${glyph.pathD}" stroke="${colors.accent}" stroke-width="${glyph.strokeWidth}" fill="none" filter="url(#glow)"/>
  </g>

  <text x="200" y="270" text-anchor="middle" font-family="${fontFamily}" font-size="12" fill="${colors.accent}" opacity="0.9" font-style="italic">
    "${escapeXml(displayQuestion)}"
  </text>

  <line x1="60" y1="300" x2="340" y2="300" stroke="${colors.accent}" stroke-width="1" opacity="0.3"/>

  <text x="200" y="330" text-anchor="middle" font-family="${fontFamily}" font-size="11" fill="${colors.accent}" opacity="0.7">
    ${escapeXml(dateStr)} · @${escapeXml(username)}
  </text>

  ${
    hasAiReading
      ? `<g transform="translate(355, 355)">
    <circle cx="0" cy="0" r="12" fill="${colors.accent}" opacity="0.15"/>
    <text x="0" y="4" text-anchor="middle" font-size="12">&#x2728;</text>
  </g>`
      : ""
  }
</svg>`;
}

// Generate SVG as data URI for embedding
export function generateNftSvgDataUri(config: NftVisualConfig): string {
  const svg = generateNftSvg(config);
  const encoded = Buffer.from(svg).toString("base64");
  return `data:image/svg+xml;base64,${encoded}`;
}
