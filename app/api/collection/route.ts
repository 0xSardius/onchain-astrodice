import { NextRequest, NextResponse } from "next/server";
import { getMintedReadings } from "@/lib/db";
import { getFidFromAuth } from "@/lib/auth";

/**
 * GET /api/collection
 * Get user's minted readings (their NFT collection)
 *
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

    const readings = await getMintedReadings(fid);

    return NextResponse.json({ readings });
  } catch (error) {
    console.error("Collection fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch collection" },
      { status: 500 }
    );
  }
}
