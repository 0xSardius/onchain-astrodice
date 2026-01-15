// Sign geometric SVG patterns for NFT borders
import type { Sign } from "@/lib/astrodice";

export interface SignPattern {
  name: string;
  // SVG path that repeats as border pattern (40x20 viewBox)
  pathD: string;
  strokeWidth: number;
}

export const SIGN_PATTERNS: Record<Sign, SignPattern> = {
  Aries: {
    name: "angular-rams-horns",
    pathD: "M0,10 L10,0 L20,10 L30,0 L40,10",
    strokeWidth: 2,
  },
  Taurus: {
    name: "steady-waves",
    pathD: "M0,10 Q10,0 20,10 Q30,20 40,10",
    strokeWidth: 2.5,
  },
  Gemini: {
    name: "twin-lines",
    pathD: "M0,5 L40,5 M0,15 L40,15",
    strokeWidth: 1.5,
  },
  Cancer: {
    name: "shell-curves",
    pathD: "M0,20 Q10,0 20,10 Q30,20 40,0",
    strokeWidth: 2,
  },
  Leo: {
    name: "flame-peaks",
    pathD: "M0,20 L10,5 L20,20 L30,5 L40,20",
    strokeWidth: 2.5,
  },
  Virgo: {
    name: "wheat-stalks",
    pathD: "M10,20 L10,0 M5,15 L10,10 L15,15 M3,10 L10,5 L17,10",
    strokeWidth: 1.5,
  },
  Libra: {
    name: "balanced-scales",
    pathD: "M0,10 L15,10 M25,10 L40,10 M20,5 L20,15",
    strokeWidth: 2,
  },
  Scorpio: {
    name: "stinger-points",
    pathD: "M0,10 L15,10 L20,0 L25,10 L40,10",
    strokeWidth: 2.5,
  },
  Sagittarius: {
    name: "arrow-flights",
    pathD: "M0,20 L20,0 M15,0 L20,0 L20,5",
    strokeWidth: 2,
  },
  Capricorn: {
    name: "mountain-peaks",
    pathD: "M0,20 L10,5 L20,15 L30,0 L40,20",
    strokeWidth: 2.5,
  },
  Aquarius: {
    name: "water-waves",
    pathD: "M0,7 Q10,3 20,7 Q30,11 40,7 M0,13 Q10,9 20,13 Q30,17 40,13",
    strokeWidth: 1.5,
  },
  Pisces: {
    name: "fish-scales",
    pathD: "M0,20 Q20,0 40,20 M10,20 Q20,10 30,20",
    strokeWidth: 2,
  },
};

export function getSignPattern(sign: Sign): SignPattern {
  return SIGN_PATTERNS[sign];
}
