// Planet color palettes for NFT background gradients
import type { Planet } from "@/lib/astrodice";

export interface ColorPalette {
  primary: string; // Main gradient start
  secondary: string; // Gradient end
  accent: string; // For typography/details
  glow: string; // For subtle glow effects
}

export const PLANET_COLORS: Record<Planet, ColorPalette> = {
  Sun: {
    primary: "#FFD700",
    secondary: "#FF8C00",
    accent: "#FFF8DC",
    glow: "rgba(255, 215, 0, 0.3)",
  },
  Moon: {
    primary: "#C0C0C0",
    secondary: "#708090",
    accent: "#F8F8FF",
    glow: "rgba(192, 192, 192, 0.3)",
  },
  Mercury: {
    primary: "#87CEEB",
    secondary: "#4682B4",
    accent: "#E0FFFF",
    glow: "rgba(135, 206, 235, 0.3)",
  },
  Venus: {
    primary: "#FFB6C1",
    secondary: "#DB7093",
    accent: "#FFF0F5",
    glow: "rgba(255, 182, 193, 0.3)",
  },
  Mars: {
    primary: "#DC143C",
    secondary: "#8B0000",
    accent: "#FFA07A",
    glow: "rgba(220, 20, 60, 0.3)",
  },
  Jupiter: {
    primary: "#9370DB",
    secondary: "#4B0082",
    accent: "#E6E6FA",
    glow: "rgba(147, 112, 219, 0.3)",
  },
  Saturn: {
    primary: "#DEB887",
    secondary: "#8B4513",
    accent: "#F5DEB3",
    glow: "rgba(222, 184, 135, 0.3)",
  },
  Uranus: {
    primary: "#00CED1",
    secondary: "#008B8B",
    accent: "#AFEEEE",
    glow: "rgba(0, 206, 209, 0.3)",
  },
  Neptune: {
    primary: "#4169E1",
    secondary: "#191970",
    accent: "#B0C4DE",
    glow: "rgba(65, 105, 225, 0.3)",
  },
  Pluto: {
    primary: "#2F4F4F",
    secondary: "#0D0D0D",
    accent: "#696969",
    glow: "rgba(47, 79, 79, 0.3)",
  },
  "North Node": {
    primary: "#32CD32",
    secondary: "#228B22",
    accent: "#90EE90",
    glow: "rgba(50, 205, 50, 0.3)",
  },
  "South Node": {
    primary: "#FF6347",
    secondary: "#B22222",
    accent: "#FFA500",
    glow: "rgba(255, 99, 71, 0.3)",
  },
};

export function getPlanetColors(planet: Planet): ColorPalette {
  return PLANET_COLORS[planet];
}
