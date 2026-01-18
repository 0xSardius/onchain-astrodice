import { NeynarAPIClient, Configuration } from "@neynar/nodejs-sdk";

function getApiKey(): string {
  const key = process.env.NEYNAR_API_KEY;
  if (!key) {
    throw new Error(
      "NEYNAR_API_KEY environment variable is not set. " +
        "Please add it to your .env file."
    );
  }
  return key;
}

// Create Neynar client lazily to avoid build-time errors
let clientInstance: NeynarAPIClient | null = null;

export function getNeynarClient(): NeynarAPIClient {
  if (!clientInstance) {
    const config = new Configuration({ apiKey: getApiKey() });
    clientInstance = new NeynarAPIClient(config);
  }
  return clientInstance;
}
