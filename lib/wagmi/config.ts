import { createConfig } from "wagmi";
import { getDefaultConfig } from "@daimo/pay";
import { farcasterFrame } from "@farcaster/miniapp-wagmi-connector";

// Use Daimo Pay's getDefaultConfig for automatic chain configuration
// This includes all chains required by Daimo Pay (Base, Arbitrum, Optimism, etc.)
const daimoConfig = getDefaultConfig({ appName: "Onchain Astrodice" });

export const config = createConfig({
  ...daimoConfig,
  connectors: [farcasterFrame()],
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
