import { generateText, streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import type { AstrodiceRoll } from "@/lib/astrodice";
import {
  getSystemPrompt,
  getBaseReadingPrompt,
  getExtendedReadingPrompt,
} from "./prompts";

// Use Claude 3.5 Sonnet for best quality/cost balance
const model = anthropic("claude-sonnet-4-20250514");

/**
 * Generate a base AI reading (200-250 words)
 * Returns the complete text (non-streaming)
 */
export async function generateBaseReading(
  question: string,
  roll: AstrodiceRoll
): Promise<string> {
  const { text } = await generateText({
    model,
    system: getSystemPrompt(),
    prompt: getBaseReadingPrompt(question, roll),
    maxOutputTokens: 400,
    temperature: 0.7,
  });

  return text;
}

/**
 * Generate a base AI reading with streaming
 * Returns a stream for real-time display
 */
export function streamBaseReading(question: string, roll: AstrodiceRoll) {
  return streamText({
    model,
    system: getSystemPrompt(),
    prompt: getBaseReadingPrompt(question, roll),
    maxOutputTokens: 400,
    temperature: 0.7,
  });
}

/**
 * Generate an extended reading (additional 150-200 words)
 * Returns the complete text (non-streaming)
 */
export async function generateExtendedReading(
  question: string,
  roll: AstrodiceRoll,
  baseReading: string
): Promise<string> {
  const { text } = await generateText({
    model,
    system: getSystemPrompt(),
    prompt: getExtendedReadingPrompt(question, roll, baseReading),
    maxOutputTokens: 350,
    temperature: 0.7,
  });

  return text;
}

/**
 * Generate an extended reading with streaming
 */
export function streamExtendedReading(
  question: string,
  roll: AstrodiceRoll,
  baseReading: string
) {
  return streamText({
    model,
    system: getSystemPrompt(),
    prompt: getExtendedReadingPrompt(question, roll, baseReading),
    maxOutputTokens: 350,
    temperature: 0.7,
  });
}
