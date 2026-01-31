import { NextRequest, NextResponse } from "next/server";
import { getReadingsByFids } from "@/lib/db";
import { getFollowingFids, getUsersByFids } from "@/lib/neynar";
import { getFidFromAuth } from "@/lib/auth";

export interface CommunityReading {
  id: number;
  userFid: number;
  username: string;
  displayName: string;
  pfpUrl: string | null;
  question: string;
  planet: string;
  sign: string;
  house: number;
  isMinted: boolean;
  createdAt: Date;
}

/**
 * GET /api/community
 * Get minted readings from users the current user follows
 *
 * Query: ?limit=20
 * Headers: Authorization: Bearer <token>
 * Returns: { readings: CommunityReading[] }
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

    // Get FIDs of users this user follows
    const followingFids = await getFollowingFids(fid);

    if (followingFids.length === 0) {
      return NextResponse.json({ readings: [] });
    }

    // Get minted readings from followed users
    const readings = await getReadingsByFids(followingFids, limit);

    if (readings.length === 0) {
      return NextResponse.json({ readings: [] });
    }

    // Get user details for all reading authors
    const authorFids = [...new Set(readings.map((r) => r.userFid))];
    const usersMap = await getUsersByFids(authorFids);

    // Combine readings with user data
    const communityReadings: CommunityReading[] = readings.map((reading) => {
      const user = usersMap.get(reading.userFid);
      return {
        id: reading.id,
        userFid: reading.userFid,
        username: user?.username ?? `fid:${reading.userFid}`,
        displayName: user?.displayName ?? `User ${reading.userFid}`,
        pfpUrl: user?.pfpUrl ?? null,
        question: reading.question,
        planet: reading.planet,
        sign: reading.sign,
        house: reading.house,
        isMinted: reading.isMinted,
        createdAt: reading.createdAt,
      };
    });

    return NextResponse.json({ readings: communityReadings });
  } catch (error) {
    console.error("Community feed error:", error);
    return NextResponse.json(
      { error: "Failed to fetch community feed" },
      { status: 500 }
    );
  }
}
