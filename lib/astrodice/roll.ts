import type { Planet, Sign, House, AstrodiceRoll } from "./types";
import { PLANET_NAMES, SIGN_NAMES, HOUSE_NUMBERS } from "./constants";

/**
 * Generate a cryptographically random number in range [0, max)
 */
function secureRandom(max: number): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % max;
}

/**
 * Roll a single planet die
 */
export function rollPlanet(): Planet {
  return PLANET_NAMES[secureRandom(PLANET_NAMES.length)];
}

/**
 * Roll a single sign die
 */
export function rollSign(): Sign {
  return SIGN_NAMES[secureRandom(SIGN_NAMES.length)];
}

/**
 * Roll a single house die
 */
export function rollHouse(): House {
  return HOUSE_NUMBERS[secureRandom(HOUSE_NUMBERS.length)];
}

/**
 * Roll all three astrodice at once
 */
export function rollAstrodice(): AstrodiceRoll {
  return {
    planet: rollPlanet(),
    sign: rollSign(),
    house: rollHouse(),
  };
}

/**
 * Generate a unique combination ID for a roll (for deduplication/tracking)
 * Format: "Planet-Sign-House" e.g. "Mars-Pisces-7"
 */
export function getRollId(roll: AstrodiceRoll): string {
  return `${roll.planet}-${roll.sign}-${roll.house}`;
}

/**
 * Calculate the total number of possible combinations
 */
export const TOTAL_COMBINATIONS = 12 * 12 * 12; // 1,728

/**
 * Format a roll as a readable string
 */
export function formatRoll(roll: AstrodiceRoll): string {
  return `${roll.planet} in ${roll.sign}, ${roll.house}${getOrdinalSuffix(roll.house)} House`;
}

/**
 * Get ordinal suffix for house number (1st, 2nd, 3rd, etc.)
 */
function getOrdinalSuffix(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}
