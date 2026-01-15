// House symbolic glyphs for NFT center element
import type { House } from "@/lib/astrodice";

export interface HouseGlyph {
  number: House;
  name: string;
  // SVG path for central glyph, viewBox 0 0 100 100
  pathD: string;
  strokeWidth: number;
}

export const HOUSE_GLYPHS: Record<House, HouseGlyph> = {
  1: {
    number: 1,
    name: "self-mirror",
    // Circle with vertical line (self/identity)
    pathD: "M50,10 A40,40 0 1,1 49.99,10 M50,20 L50,80",
    strokeWidth: 3,
  },
  2: {
    number: 2,
    name: "treasure-chest",
    // Simplified chest/coin (resources)
    pathD:
      "M20,40 L80,40 L80,80 L20,80 Z M30,40 L30,30 L70,30 L70,40 M45,55 A5,5 0 1,1 55,55 A5,5 0 1,1 45,55",
    strokeWidth: 2.5,
  },
  3: {
    number: 3,
    name: "messenger-wings",
    // Mercury wings (communication)
    pathD: "M50,80 L50,30 M30,50 L50,30 L70,50 M25,40 L50,20 L75,40",
    strokeWidth: 2.5,
  },
  4: {
    number: 4,
    name: "home-hearth",
    // House symbol (home/roots)
    pathD: "M50,15 L85,45 L85,85 L15,85 L15,45 Z M40,85 L40,60 L60,60 L60,85",
    strokeWidth: 2.5,
  },
  5: {
    number: 5,
    name: "creative-star",
    // Five-pointed star (creativity)
    pathD:
      "M50,10 L61,40 L95,40 L68,58 L79,90 L50,70 L21,90 L32,58 L5,40 L39,40 Z",
    strokeWidth: 2,
  },
  6: {
    number: 6,
    name: "service-hands",
    // Hands/work symbol (service/health)
    pathD:
      "M25,80 L25,50 Q25,30 40,30 L60,30 Q75,30 75,50 L75,80 M40,50 L40,65 M60,50 L60,65",
    strokeWidth: 2.5,
  },
  7: {
    number: 7,
    name: "partnership-scales",
    // Balanced scales (relationships)
    pathD:
      "M50,20 L50,75 M25,75 L75,75 M20,40 L50,30 L80,40 M15,40 L15,60 L35,60 L35,40 M65,40 L65,60 L85,60 L85,40",
    strokeWidth: 2.5,
  },
  8: {
    number: 8,
    name: "phoenix-rebirth",
    // Phoenix/transformation symbol
    pathD:
      "M50,85 L50,50 M35,65 L50,50 L65,65 M25,35 Q50,10 75,35 M35,25 Q50,5 65,25",
    strokeWidth: 2.5,
  },
  9: {
    number: 9,
    name: "arrow-horizon",
    // Sagittarius arrow (philosophy/expansion)
    pathD: "M20,80 L80,20 M55,20 L80,20 L80,45 M30,50 Q50,30 70,50",
    strokeWidth: 3,
  },
  10: {
    number: 10,
    name: "mountain-summit",
    // Mountain peak (career/public image)
    pathD: "M10,85 L50,20 L90,85 Z M35,85 L50,55 L65,85",
    strokeWidth: 2.5,
  },
  11: {
    number: 11,
    name: "community-network",
    // Connected nodes (community)
    pathD:
      "M50,25 A10,10 0 1,1 50.01,25 M25,60 A10,10 0 1,1 25.01,60 M75,60 A10,10 0 1,1 75.01,60 M50,35 L30,55 M50,35 L70,55 M35,65 L65,65",
    strokeWidth: 2,
  },
  12: {
    number: 12,
    name: "cosmic-eye",
    // Third eye/spiritual symbol (unconscious)
    pathD:
      "M10,50 Q50,10 90,50 Q50,90 10,50 M50,35 A15,15 0 1,1 50.01,35",
    strokeWidth: 2.5,
  },
};

export function getHouseGlyph(house: House): HouseGlyph {
  return HOUSE_GLYPHS[house];
}
