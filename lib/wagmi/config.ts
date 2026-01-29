import { http, createConfig } from "wagmi";
import {
  arbitrum,
  base,
  bsc,
  celo,
  gnosis,
  linea,
  mainnet,
  optimism,
  polygon,
  scroll,
} from "wagmi/chains";
import { farcasterFrame } from "@farcaster/miniapp-wagmi-connector";

// Daimo Pay requires multiple chains for cross-chain payments
// Base is primary for this app, others are for Daimo Pay compatibility
export const config = createConfig({
  chains: [base, mainnet, arbitrum, optimism, polygon, bsc, celo, gnosis, linea, scroll],
  transports: {
    [base.id]: http(),
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
    [polygon.id]: http(),
    [bsc.id]: http(),
    [celo.id]: http(),
    [gnosis.id]: http(),
    [linea.id]: http(),
    [scroll.id]: http(),
  },
  connectors: [farcasterFrame()],
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
