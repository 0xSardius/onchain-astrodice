import { NextRequest, NextResponse } from "next/server";
import { createReading, getUserReadings, upsertUser } from "@/lib/db";
import { getFidFromAuth } from "@/lib/auth";
import type { Planet, Sign, House } from "@/lib/astrodice";

/**
 * GET /api/readings
 * Get user's readings
 *
 * Query: ?limit=20
 * Headers: Authorization: Bearer <token>
 * Returns: { readings: Reading[] }
 */
export async function GET(request: NextRequest) {
  try {
    const fid = getFidFromAuth(request);
    if (!fid) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const limitParam = request.nextUrl.searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : 20;

    const readings = await getUserReadings(fid, limit);

    return NextResponse.json({ readings });
  } catch (error) {
    console.error("Get readings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch readings" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/readings
 * Create a new reading
 *
 * Headers: Authorization: Bearer <token>
 * Body: { question: string, planet: Planet, sign: Sign, house: House }
 * Returns: { reading: Reading }
 */
export async function POST(request: NextRequest) {
  try {
    const fid = getFidFromAuth(request);
    if (!fid) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { question, planet, sign, house } = body;

    // Validate required fields
    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    if (!planet || !sign || !house) {
      return NextResponse.json(
        { error: "Planet, sign, and house are required" },
        { status: 400 }
      );
    }

    // Ensure user exists before creating reading (foreign key constraint)
    await upsertUser(fid);

    const reading = await createReading({
      userFid: fid,
      question: question.trim(),
      planet: planet as Planet,
      sign: sign as Sign,
      house: house as House,
    });

    return NextResponse.json({ reading }, { status: 201 });
  } catch (error) {
    console.error("Create reading error:", error);
    return NextResponse.json(
      { error: "Failed to create reading" },
      { status: 500 }
    );
  }
}
