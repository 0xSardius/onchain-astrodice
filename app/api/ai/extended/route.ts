import { NextRequest } from "next/server";
import { streamExtendedReading } from "@/lib/ai";
import { getReadingById, addExtendedReading } from "@/lib/db";
import type { Planet, Sign, House } from "@/lib/astrodice";

/**
 * Helper to extract FID from Authorization header
 */
function getFidFromAuth(request: NextRequest): number | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  try {
    const token = authHeader.slice(7);
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));
    return typeof payload.fid === "number" ? payload.fid : null;
  } catch {
    return null;
  }
}

/**
 * POST /api/ai/extended
 * Generate extended AI interpretation for a reading (+$1)
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

    // Must have base AI reading first
    if (!reading.aiReading) {
      return new Response(
        JSON.stringify({ error: "Must purchase base AI reading first" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Check if already has extended reading
    if (reading.extendedReading) {
      return new Response(
        JSON.stringify({
          error: "Reading already has extended interpretation",
          extendedReading: reading.extendedReading,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // TODO: Verify +$1 payment before generating
    // For now, we'll generate without payment verification

    // Generate streaming response
    const result = streamExtendedReading(
      reading.question,
      {
        planet: reading.planet as Planet,
        sign: reading.sign as Sign,
        house: reading.house as House,
      },
      reading.aiReading
    );

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
        await addExtendedReading(readingId, fullText);
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
    console.error("Extended reading error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate reading" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
