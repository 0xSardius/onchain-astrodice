import { createConfig } from "wagmi";
import { getDefaultConfig } from "@daimo/pay";
import { farcasterFrame } from "@farcaster/miniapp-wagmi-connector";
import { base } from "viem/chains";

// Use Daimo Pay's getDefaultConfig for automatic chain configuration
// This includes all chains required by Daimo Pay (Base, Arbitrum, Optimism, etc.)
const daimoConfig = getDefaultConfig({ appName: "Onchain Astrodice" });

// Ensure Base is explicitly first in the chains list so wagmi types recognize it
// and it's the default chain for transactions (NFT contract lives on Base)
const daimoChains = daimoConfig.chains ?? [];
const chains = [base, ...daimoChains.filter((c) => c.id !== base.id)] as [
  typeof base,
  ...typeof daimoChains,
];

export const config = createConfig({
  ...daimoConfig,
  chains,
  connectors: [farcasterFrame()],
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
