import { quickAuth } from "@farcaster/miniapp-sdk";
import { sdk } from "./sdk";

export interface AuthToken {
  token: string;
  fid: number;
}

/**
 * Get authentication token from Farcaster Quick Auth
 * Returns JWT containing user's FID
 */
export async function getAuthToken(): Promise<AuthToken | null> {
  try {
    const result = await quickAuth.getToken();
    if (result?.token) {
      // Decode FID from JWT payload (base64 middle section)
      const payload = JSON.parse(atob(result.token.split(".")[1]));
      return {
        token: result.token,
        fid: payload.fid,
      };
    }
    return null;
  } catch (error) {
    console.error("Failed to get auth token:", error);
    return null;
  }
}

/**
 * Make authenticated fetch request using Quick Auth
 */
export async function authenticatedFetch(
  url: string,
  options?: RequestInit
): Promise<Response> {
  return quickAuth.fetch(url, options);
}

/**
 * Compose a cast for sharing readings
 */
export async function composeCast(text: string, embedUrl?: string) {
  return sdk.actions.composeCast({
    text,
    embeds: embedUrl ? [embedUrl] : undefined,
  });
}
