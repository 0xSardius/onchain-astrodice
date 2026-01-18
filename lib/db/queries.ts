import { eq, and, lt, desc, inArray } from "drizzle-orm";
import { db } from "./client";
import { users, readings } from "./schema";
import type { Planet, Sign, House } from "@/lib/astrodice";

// ============================================
// USER QUERIES
// ============================================

export async function upsertUser(fid: number, username?: string) {
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.fid, fid))
    .limit(1);

  if (existing.length > 0) {
    // Update username if provided
    if (username) {
      await db.update(users).set({ username }).where(eq(users.fid, fid));
    }
    return existing[0];
  }

  // Create new user
  const [newUser] = await db
    .insert(users)
    .values({ fid, username })
    .returning();
  return newUser;
}

export async function getUserByFid(fid: number) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.fid, fid))
    .limit(1);
  return user || null;
}

// ============================================
// READING QUERIES
// ============================================

export async function createReading(data: {
  userFid: number;
  question: string;
  planet: Planet;
  sign: Sign;
  house: House;
}) {
  // Set expiration to 24 hours from now
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const [reading] = await db
    .insert(readings)
    .values({
      ...data,
      expiresAt,
    })
    .returning();

  return reading;
}

export async function getReadingById(id: number) {
  const [reading] = await db
    .select()
    .from(readings)
    .where(eq(readings.id, id))
    .limit(1);
  return reading || null;
}

export async function getUserReadings(userFid: number, limit = 20) {
  return db
    .select()
    .from(readings)
    .where(eq(readings.userFid, userFid))
    .orderBy(desc(readings.createdAt))
    .limit(limit);
}

export async function getMintedReadings(userFid: number) {
  return db
    .select()
    .from(readings)
    .where(and(eq(readings.userFid, userFid), eq(readings.isMinted, true)))
    .orderBy(desc(readings.createdAt));
}

export async function getRecentUnmintedReadings(userFid: number) {
  // Get unminted readings that haven't expired
  // Note: expiresAt is null for minted readings, set to 24h for unminted
  return db
    .select()
    .from(readings)
    .where(
      and(
        eq(readings.userFid, userFid),
        eq(readings.isMinted, false)
      )
    )
    .orderBy(desc(readings.createdAt));
}

export async function addAiReading(readingId: number, aiReading: string) {
  const [updated] = await db
    .update(readings)
    .set({ aiReading })
    .where(eq(readings.id, readingId))
    .returning();
  return updated;
}

export async function addExtendedReading(
  readingId: number,
  extendedReading: string
) {
  const [updated] = await db
    .update(readings)
    .set({ extendedReading })
    .where(eq(readings.id, readingId))
    .returning();
  return updated;
}

export async function markReadingAsMinted(
  readingId: number,
  tokenId: number,
  txHash: string
) {
  const [updated] = await db
    .update(readings)
    .set({
      isMinted: true,
      tokenId,
      txHash,
      expiresAt: null, // Minted readings don't expire
    })
    .where(eq(readings.id, readingId))
    .returning();
  return updated;
}

// ============================================
// CLEANUP QUERIES
// ============================================

export async function deleteExpiredReadings() {
  const now = new Date();
  const result = await db
    .delete(readings)
    .where(
      and(
        eq(readings.isMinted, false),
        lt(readings.expiresAt, now)
      )
    )
    .returning({ id: readings.id });
  return result.length;
}

// ============================================
// COMMUNITY QUERIES
// ============================================

export async function getReadingsByFids(fids: number[], limit = 50) {
  if (fids.length === 0) return [];

  // Get recent minted readings from a list of FIDs (for community feed)
  return db
    .select({
      id: readings.id,
      userFid: readings.userFid,
      question: readings.question,
      planet: readings.planet,
      sign: readings.sign,
      house: readings.house,
      isMinted: readings.isMinted,
      createdAt: readings.createdAt,
    })
    .from(readings)
    .where(
      and(
        inArray(readings.userFid, fids),
        eq(readings.isMinted, true)
      )
    )
    .orderBy(desc(readings.createdAt))
    .limit(limit);
}
