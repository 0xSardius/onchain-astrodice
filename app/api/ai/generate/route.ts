import { NextRequest } from "next/server";
import { streamBaseReading } from "@/lib/ai";
import type { Planet, Sign, House } from "@/lib/astrodice";
import { PLANET_NAMES, SIGN_NAMES, HOUSE_NUMBERS } from "@/lib/astrodice";

/**
 * POST /api/ai/generate
 * Generate AI interpretation directly from roll data (for testing)
 * In production, use /api/ai/reading with database and payment
 *
 * Body: { question: string, planet: Planet, sign: Sign, house: House }
 * Returns: Streaming text response
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, planet, sign, house } = body;

    // Validate inputs
    if (!question || typeof question !== "string" || question.length < 3) {
      return new Response(
        JSON.stringify({ error: "Question must be at least 3 characters" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!PLANET_NAMES.includes(planet)) {
      return new Response(
        JSON.stringify({ error: "Invalid planet" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!SIGN_NAMES.includes(sign)) {
      return new Response(
        JSON.stringify({ error: "Invalid sign" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!HOUSE_NUMBERS.includes(house)) {
      return new Response(
        JSON.stringify({ error: "Invalid house" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Generate streaming response
    const result = streamBaseReading(question, {
      planet: planet as Planet,
      sign: sign as Sign,
      house: house as House,
    });

    // Create a transform stream
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();

    // Process the stream
    (async () => {
      try {
        const response = await result;
        for await (const chunk of response.textStream) {
          await writer.write(encoder.encode(chunk));
        }
        await writer.close();
      } catch (error) {
        console.error("Stream error:", error);
        await writer.abort(error);
      }
    })();

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("AI generate error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate reading" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
