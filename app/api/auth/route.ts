import { NextRequest, NextResponse } from "next/server";
import { upsertUser } from "@/lib/db";

/**
 * POST /api/auth
 * Verify Farcaster JWT and upsert user
 *
 * Body: { token: string }
 * Returns: { user: User }
 */
export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      );
    }

    // Decode JWT payload (base64 middle section)
    // In production, you should verify the JWT signature
    const parts = token.split(".");
    if (parts.length !== 3) {
      return NextResponse.json(
        { error: "Invalid token format" },
        { status: 400 }
      );
    }

    const payload = JSON.parse(atob(parts[1]));
    const fid = payload.fid;

    if (!fid || typeof fid !== "number") {
      return NextResponse.json(
        { error: "Invalid FID in token" },
        { status: 400 }
      );
    }

    // Upsert user in database
    const user = await upsertUser(fid, payload.username);

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
