import { NextRequest } from "next/server";
import { streamBaseReading } from "@/lib/ai";
import { getReadingById, addAiReading } from "@/lib/db";
import { getFidFromAuth } from "@/lib/auth";
import type { Planet, Sign, House } from "@/lib/astrodice";

/**
 * POST /api/ai/reading
 * Generate AI interpretation for a reading ($2)
 *
 * Body: { readingId: number }
 * Returns: Streaming text response
 */
export async function POST(request: NextRequest) {
  try {
    const fid = getFidFromAuth(request);
    if (!fid) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await request.json();
    const { readingId } = body;

    if (!readingId) {
      return new Response(JSON.stringify({ error: "Reading ID required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get the reading
    const reading = await getReadingById(readingId);
    if (!reading) {
      return new Response(JSON.stringify({ error: "Reading not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Verify ownership
    if (reading.userFid !== fid) {
      return new Response(JSON.stringify({ error: "Not authorized" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if already has AI reading
    if (reading.aiReading) {
      return new Response(
        JSON.stringify({
          error: "Reading already has AI interpretation",
          aiReading: reading.aiReading,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // TODO: Verify payment before generating
    // For now, we'll generate without payment verification
    // In production, check for $2 payment on Base

    // Generate streaming response
    const result = streamBaseReading(reading.question, {
      planet: reading.planet as Planet,
      sign: reading.sign as Sign,
      house: reading.house as House,
    });

    // Collect the full text to save to database
    let fullText = "";

    // Create a transform stream to capture the text
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();

    // Process the stream
    (async () => {
      try {
        const response = await result;
        for await (const chunk of response.textStream) {
          fullText += chunk;
          await writer.write(encoder.encode(chunk));
        }

        // Save to database after completion
        await addAiReading(readingId, fullText);
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
    console.error("AI reading error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate reading" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
