import { NextRequest, NextResponse } from "next/server";
import {
  getReadingById,
  addAiReading,
  addExtendedReading,
  markReadingAsMinted,
} from "@/lib/db";
import { getFidFromAuth } from "@/lib/auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * GET /api/readings/[id]
 * Get a single reading by ID
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const readingId = parseInt(id, 10);

    if (isNaN(readingId)) {
      return NextResponse.json(
        { error: "Invalid reading ID" },
        { status: 400 }
      );
    }

    const reading = await getReadingById(readingId);

    if (!reading) {
      return NextResponse.json(
        { error: "Reading not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ reading });
  } catch (error) {
    console.error("Get reading error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reading" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/readings/[id]
 * Update a reading (add AI reading, extended reading, or mark as minted)
 *
 * Body options:
 * - { aiReading: string } - Add AI interpretation
 * - { extendedReading: string } - Add extended reading
 * - { isMinted: true, tokenId: number, txHash: string } - Mark as minted
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const fid = getFidFromAuth(request);
    if (!fid) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const readingId = parseInt(id, 10);

    if (isNaN(readingId)) {
      return NextResponse.json(
        { error: "Invalid reading ID" },
        { status: 400 }
      );
    }

    // Check reading exists and belongs to user
    const existing = await getReadingById(readingId);
    if (!existing) {
      return NextResponse.json(
        { error: "Reading not found" },
        { status: 404 }
      );
    }

    if (existing.userFid !== fid) {
      return NextResponse.json(
        { error: "Not authorized to update this reading" },
        { status: 403 }
      );
    }

    const body = await request.json();
    let updated;

    // Handle different update types
    if (body.aiReading) {
      updated = await addAiReading(readingId, body.aiReading);
    } else if (body.extendedReading) {
      updated = await addExtendedReading(readingId, body.extendedReading);
    } else if (body.isMinted && body.tokenId && body.txHash) {
      updated = await markReadingAsMinted(
        readingId,
        body.tokenId,
        body.txHash
      );
    } else {
      return NextResponse.json(
        { error: "Invalid update data" },
        { status: 400 }
      );
    }

    return NextResponse.json({ reading: updated });
  } catch (error) {
    console.error("Update reading error:", error);
    return NextResponse.json(
      { error: "Failed to update reading" },
      { status: 500 }
    );
  }
}
