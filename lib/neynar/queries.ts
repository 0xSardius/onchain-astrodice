import { getNeynarClient } from "./client";

export interface FarcasterUser {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl: string | null;
}

/**
 * Get the FIDs of users that a given user follows
 */
export async function getFollowingFids(fid: number): Promise<number[]> {
  const client = getNeynarClient();
  const fids: number[] = [];
  let cursor: string | undefined;

  // Paginate through all following
  do {
    const response = await client.fetchUserFollowing({
      fid,
      limit: 100,
      cursor,
    });

    for (const follow of response.users) {
      fids.push(follow.fid);
    }

    cursor = response.next?.cursor ?? undefined;
  } while (cursor);

  return fids;
}

/**
 * Look up user details by FID
 */
export async function getUserByFid(fid: number): Promise<FarcasterUser | null> {
  const client = getNeynarClient();

  try {
    const response = await client.fetchBulkUsers({ fids: [fid] });
    const user = response.users[0];

    if (!user) return null;

    return {
      fid: user.fid,
      username: user.username,
      displayName: user.display_name ?? user.username,
      pfpUrl: user.pfp_url ?? null,
    };
  } catch {
    return null;
  }
}

/**
 * Look up multiple users by FIDs
 */
export async function getUsersByFids(fids: number[]): Promise<Map<number, FarcasterUser>> {
  if (fids.length === 0) return new Map();

  const client = getNeynarClient();
  const userMap = new Map<number, FarcasterUser>();

  // Neynar limits bulk lookups to 100 at a time
  const chunks: number[][] = [];
  for (let i = 0; i < fids.length; i += 100) {
    chunks.push(fids.slice(i, i + 100));
  }

  for (const chunk of chunks) {
    try {
      const response = await client.fetchBulkUsers({ fids: chunk });

      for (const user of response.users) {
        userMap.set(user.fid, {
          fid: user.fid,
          username: user.username,
          displayName: user.display_name ?? user.username,
          pfpUrl: user.pfp_url ?? null,
        });
      }
    } catch {
      // Continue with other chunks if one fails
    }
  }

  return userMap;
}
