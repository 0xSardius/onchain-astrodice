import { NextRequest, NextResponse } from "next/server";
import { getMintedReadings } from "@/lib/db";

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
