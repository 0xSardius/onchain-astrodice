import { NextRequest } from "next/server";
import { createClient } from "@farcaster/quick-auth";

// Create Quick Auth client for JWT verification
const quickAuthClient = createClient();

/**
 * Extract and verify FID from Farcaster JWT in Authorization header
 * Uses official @farcaster/quick-auth library for proper verification
 *
 * JWT payload structure:
 * {
 *   "iat": 1747764819,
 *   "iss": "https://auth.farcaster.xyz",
 *   "exp": 1747768419,
 *   "sub": 6841,  // FID is in 'sub' field
 *   "aud": "miniapps.farcaster.xyz"
 * }
 */
export async function getFidFromAuthAsync(
  request: NextRequest
): Promise<number | null> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  try {
    const token = authHeader.slice(7);

    // Get the domain from the request for verification
    const host = request.headers.get("host") || "onchain-astrodice.vercel.app";

    // Verify JWT using official Farcaster library
    const payload = await quickAuthClient.verifyJwt({
      token,
      domain: host,
    });

    // FID is in the 'sub' field
    const fid = payload.sub;

    if (typeof fid === "number") {
      return fid;
    } else if (typeof fid === "string") {
      const fidNum = parseInt(fid, 10);
      return isNaN(fidNum) ? null : fidNum;
    }

    return null;
  } catch (err) {
    console.error("Failed to verify auth token:", err);
    return null;
  }
}

/**
 * Synchronous version that just decodes without verification
 * Use getFidFromAuthAsync for proper verification
 */
export function getFidFromAuth(request: NextRequest): number | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  try {
    const token = authHeader.slice(7);
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    // Decode JWT payload (base64url -> JSON)
    // Use Buffer for Node.js compatibility (atob is browser-only)
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const jsonString = Buffer.from(base64, "base64").toString("utf-8");
    const payload = JSON.parse(jsonString);

    // FID is in 'sub' field per Farcaster docs
    const fid = payload.sub;

    if (fid === undefined || fid === null) {
      console.error("No 'sub' field in JWT payload:", Object.keys(payload));
      return null;
    }

    // Convert to number if string
    const fidNum = typeof fid === "string" ? parseInt(fid, 10) : fid;

    return typeof fidNum === "number" && !isNaN(fidNum) ? fidNum : null;
  } catch (err) {
    console.error("Failed to parse auth token:", err);
    return null;
  }
}

/**
 * Extract username from Farcaster JWT payload
 */
export function getUsernameFromAuth(request: NextRequest): string {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return "anonymous";
  }

  try {
    const token = authHeader.slice(7);
    const parts = token.split(".");
    if (parts.length !== 3) return "anonymous";

    // Use Buffer for Node.js compatibility
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const jsonString = Buffer.from(base64, "base64").toString("utf-8");
    const payload = JSON.parse(jsonString);

    // Try to get username, fall back to FID
    const username = payload.username ?? payload.name;
    const fid = payload.sub;

    if (username) {
      return username;
    } else if (fid) {
      return `fid:${fid}`;
    }

    return "anonymous";
  } catch {
    return "anonymous";
  }
}
