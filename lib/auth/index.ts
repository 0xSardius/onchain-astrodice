import { NextRequest } from "next/server";

/**
 * Extract FID from Farcaster JWT in Authorization header
 *
 * Farcaster JWTs can have the FID in different fields:
 * - `sub` (standard JWT subject field)
 * - `fid` (direct field)
 *
 * The FID can be a string or number.
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
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));

    // Try different fields where FID might be stored
    const fid = payload.fid ?? payload.sub ?? payload.userId;

    if (fid === undefined || fid === null) {
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

    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));

    // Try to get username from various fields
    const username = payload.username ?? payload.name;
    const fid = payload.fid ?? payload.sub;

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
