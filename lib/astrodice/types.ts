// Planet represents the energy/action happening
export type Planet =
  | "Sun"
  | "Moon"
  | "Mercury"
  | "Venus"
  | "Mars"
  | "Jupiter"
  | "Saturn"
  | "Uranus"
  | "Neptune"
  | "Pluto"
  | "North Node"
  | "South Node";

// Sign represents how the energy manifests (style/approach)
export type Sign =
  | "Aries"
  | "Taurus"
  | "Gemini"
  | "Cancer"
  | "Leo"
  | "Virgo"
  | "Libra"
  | "Scorpio"
  | "Sagittarius"
  | "Capricorn"
  | "Aquarius"
  | "Pisces";

// House represents where in life (domain/area)
export type House = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

// A complete astrodice roll result
export interface AstrodiceRoll {
  planet: Planet;
  sign: Sign;
  house: House;
}

// Element info with symbol and meaning
export interface PlanetInfo {
  name: Planet;
  symbol: string;
  keywords: string[];
  meaning: string;
}

export interface SignInfo {
  name: Sign;
  symbol: string;
  element: "Fire" | "Earth" | "Air" | "Water";
  modality: "Cardinal" | "Fixed" | "Mutable";
  keywords: string[];
  meaning: string;
}

export interface HouseInfo {
  number: House;
  name: string;
  keywords: string[];
  meaning: string;
}

// Reading stored in database
export interface Reading {
  id: string;
  userFid: number;
  question: string;
  planet: Planet;
  sign: Sign;
  house: House;
  aiReading: string | null;
  extendedReading: string | null;
  isMinted: boolean;
  tokenId: number | null;
  txHash: string | null;
  createdAt: Date;
  expiresAt: Date | null;
}
