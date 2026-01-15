import { NextRequest, NextResponse } from "next/server";
import { getReadingById, markReadingAsMinted } from "@/lib/db";
import { uploadNftMetadata } from "@/lib/nft";
import type { Planet, Sign, House } from "@/lib/astrodice";

/**
 * Helper to extract FID from Authorization header
 * In production, verify the JWT signature
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
 * Extract username from JWT payload
 */
function getUsernameFromAuth(request: NextRequest): string {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return "anonymous";
  }

  try {
    const token = authHeader.slice(7);
    const parts = token.split(".");
    if (parts.length !== 3) return "anonymous";

    const payload = JSON.parse(atob(parts[1]));
    return payload.username || `fid:${payload.fid}`;
  } catch {
    return "anonymous";
  }
}

/**
 * POST /api/mint
 * Prepare NFT metadata and upload to IPFS
 *
 * Headers: Authorization: Bearer <token>
 * Body: { readingId: number, walletAddress: string }
 * Returns: { success, readingId, metadataUri, imageUri, contractAddress, mintParams }
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate
    const fid = getFidFromAuth(request);
    if (!fid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const username = getUsernameFromAuth(request);

    // 2. Parse request
    const body = await request.json();
    const { readingId, walletAddress } = body;

    if (!readingId || typeof readingId !== "number") {
      return NextResponse.json(
        { error: "readingId is required" },
        { status: 400 }
      );
    }

    if (!walletAddress || typeof walletAddress !== "string") {
      return NextResponse.json(
        { error: "walletAddress is required" },
        { status: 400 }
      );
    }

    // 3. Fetch reading from database
    const reading = await getReadingById(readingId);

    if (!reading) {
      return NextResponse.json({ error: "Reading not found" }, { status: 404 });
    }

    // 4. Verify ownership
    if (reading.userFid !== fid) {
      return NextResponse.json(
        { error: "You can only mint your own readings" },
        { status: 403 }
      );
    }

    // 5. Check if already minted
    if (reading.isMinted) {
      return NextResponse.json(
        { error: "Reading already minted", tokenId: reading.tokenId },
        { status: 409 }
      );
    }

    // 6. Check environment
    const contractAddress = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;
    if (!contractAddress) {
      return NextResponse.json(
        { error: "NFT contract not configured" },
        { status: 500 }
      );
    }

    // 7. Generate and upload metadata to IPFS
    const { metadataUri, imageUri } = await uploadNftMetadata({
      readingId: reading.id,
      roll: {
        planet: reading.planet as Planet,
        sign: reading.sign as Sign,
        house: reading.house as House,
      },
      question: reading.question,
      username,
      userFid: fid,
      timestamp: reading.createdAt,
      aiReading: reading.aiReading,
      extendedReading: reading.extendedReading,
    });

    // 8. Return mint parameters for client-side transaction
    return NextResponse.json({
      success: true,
      readingId,
      metadataUri,
      imageUri,
      contractAddress,
      mintParams: {
        to: walletAddress,
        uri: metadataUri,
      },
    });
  } catch (error) {
    console.error("Mint prepare error:", error);
    return NextResponse.json(
      { error: "Failed to prepare mint" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/mint
 * Called after successful mint to update database
 *
 * Headers: Authorization: Bearer <token>
 * Body: { readingId: number, tokenId: number, txHash: string }
 * Returns: { success, reading }
 */
export async function PATCH(request: NextRequest) {
  try {
    const fid = getFidFromAuth(request);
    if (!fid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { readingId, tokenId, txHash } = body;

    if (!readingId || tokenId === undefined || !txHash) {
      return NextResponse.json(
        { error: "readingId, tokenId, and txHash are required" },
        { status: 400 }
      );
    }

    // Verify ownership
    const reading = await getReadingById(readingId);
    if (!reading || reading.userFid !== fid) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update database
    const updated = await markReadingAsMinted(readingId, tokenId, txHash);

    return NextResponse.json({
      success: true,
      reading: updated,
    });
  } catch (error) {
    console.error("Mint update error:", error);
    return NextResponse.json(
      { error: "Failed to update mint status" },
      { status: 500 }
    );
  }
}
