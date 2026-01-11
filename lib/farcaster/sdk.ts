import sdk from "@farcaster/miniapp-sdk";

// Initialize SDK context
let isInitialized = false;

export async function initializeSdk() {
  if (isInitialized) return;

  // Load SDK context
  await sdk.actions.ready();
  isInitialized = true;
}

export { sdk };
