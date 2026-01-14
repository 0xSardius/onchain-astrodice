import type { AstrodiceRoll } from "@/lib/astrodice";
import { getPlanetInfo, getSignInfo, getHouseInfo } from "@/lib/astrodice";

/**
 * Generate the system prompt for astrodice readings
 */
export function getSystemPrompt(): string {
  return `You are an expert astrologer interpreting astrodice readings. You combine deep astrological knowledge with intuitive wisdom to provide meaningful, personalized guidance.

Your interpretations should be:
- Mystical but grounded - blend cosmic language with practical insight
- Warm and compassionate - speak directly to the querent's heart
- Specific to the question - always tie back to what they asked
- Empowering - focus on agency and possibility, not fate
- Honest - acknowledge challenges while offering paths forward

Avoid:
- Generic horoscope language ("this is a good time for...")
- Doom and gloom predictions
- Definitive statements about the future
- Overly abstract or vague guidance
- Excessive caveats or disclaimers`;
}

/**
 * Generate the base reading prompt (200-250 words)
 */
export function getBaseReadingPrompt(
  question: string,
  roll: AstrodiceRoll
): string {
  const planet = getPlanetInfo(roll.planet);
  const sign = getSignInfo(roll.sign);
  const house = getHouseInfo(roll.house);

  return `The querent asked: "${question}"

They rolled:
- **Planet: ${planet.name}** (${planet.symbol})
  Keywords: ${planet.keywords.join(", ")}
  Meaning: ${planet.meaning}

- **Sign: ${sign.name}** (${sign.symbol}) - ${sign.element} / ${sign.modality}
  Keywords: ${sign.keywords.join(", ")}
  Meaning: ${sign.meaning}

- **House: ${house.number} - ${house.name}**
  Keywords: ${house.keywords.join(", ")}
  Meaning: ${house.meaning}

Write a 200-250 word interpretation that synthesizes these three elements into cohesive guidance. Structure your response as:

1. Open by acknowledging their question and the energy present
2. Explain what ${planet.name} brings to this situation (the what)
3. Describe how ${sign.name} shapes its expression (the how)
4. Ground it in the ${house.name} life area (the where)
5. Close with actionable insight or reflection

Write in second person ("you"), speaking directly to them. Be specific to their question. Do not use headers or bullet points - write in flowing paragraphs.`;
}

/**
 * Generate the extended reading prompt (additional 150-200 words)
 */
export function getExtendedReadingPrompt(
  question: string,
  roll: AstrodiceRoll,
  baseReading: string
): string {
  const planet = getPlanetInfo(roll.planet);
  const sign = getSignInfo(roll.sign);
  const house = getHouseInfo(roll.house);

  return `The querent asked: "${question}"

They rolled: ${planet.name} in ${sign.name}, ${house.number}th House

You already provided this base reading:
"""
${baseReading}
"""

Now provide an extended reflection (150-200 words) that goes deeper. Include:

1. **Shadow work**: What unconscious patterns or resistances might arise with this energy? What should they be mindful of?

2. **Timing wisdom**: How might this energy unfold over time? Is this about immediate action or patient cultivation?

3. **Questions for reflection**: End with 2-3 specific questions they can sit with. These should be personal and tied to their original question.

Format the reflection questions as a short list at the end. The rest should be flowing prose.`;
}

/**
 * Token estimation for cost tracking
 */
export function estimateTokens(text: string): number {
  // Rough estimate: ~4 characters per token for English
  return Math.ceil(text.length / 4);
}
