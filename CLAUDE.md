# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Onchain Astrodice is a Farcaster miniapp that generates astrological readings using the astrodice system (Planet + Sign + House), with AI-powered interpretation and NFT collectibility on Base. Users can roll dice, get AI readings ($2), and mint readings as NFTs.

**Current State:** Phase 6 - Production Polish. App is deployed and functional. Core flow (roll → pay → AI reading → save) works. Minting requires contract permission fix. See `SCRATCHPAD.md` for detailed session progress.

**Live URL:** https://onchain-astrodice.vercel.app

## Commands

```bash
pnpm dev      # Start development server (http://localhost:3000)
pnpm build    # Production build
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **Package Manager**: pnpm

### Installed Dependencies
- **Farcaster**: `@farcaster/miniapp-sdk`, `@farcaster/miniapp-wagmi-connector`, `@farcaster/quick-auth`
- **Blockchain**: `wagmi`, `viem`, `@tanstack/react-query`, `thirdweb`
- **Payments**: `@daimo/pay` (for $2 AI reading payments)
- **Database**: `@neondatabase/serverless`, `drizzle-orm`
- **AI**: `ai`, `@ai-sdk/anthropic`
- **Social**: `@neynar/nodejs-sdk`

## Directory Structure

```
app/
├── layout.tsx              # Root layout with providers
├── page.tsx                # Home - question input + roll CTA
├── providers.tsx           # Wagmi + QueryClient + DaimoPay providers
├── collection/page.tsx     # User's minted readings
├── community/page.tsx      # Follows' readings feed
└── api/
    ├── auth/route.ts       # Verify Farcaster JWT
    ├── readings/           # CRUD for readings
    ├── ai/                 # AI reading generation
    ├── mint/route.ts       # NFT minting prep
    ├── collection/route.ts # User's minted NFTs
    └── community/route.ts  # Social feed

components/
├── ui/                     # Base UI (toast, error-boundary, how-it-works)
├── dice/                   # Rolling interface + animation
├── reading/                # Reading display + AI reading
├── nft/                    # NFT preview + mint button
├── layout/                 # Header, nav, background
├── share/                  # Farcaster share button
├── collection/             # Collection grid + cards
└── community/              # Reading feed + cards

lib/
├── astrodice/              # Types, constants, roll logic
├── auth/                   # JWT parsing (getFidFromAuth)
├── db/                     # Neon Postgres client + queries
├── farcaster/              # SDK wrapper
├── wagmi/                  # Config (uses Daimo's getDefaultConfig)
├── nft/                    # Metadata, SVG generation, IPFS upload
├── ai/                     # Prompts + streaming generation
└── neynar/                 # Farcaster social graph queries

types/                      # TypeScript definitions
```

## Core Mechanics

The astrodice system uses three 12-sided conceptual dice:
- **Planet** (12 options): What energy/action is happening
- **Sign** (12 options): How it manifests (style/approach)
- **House** (12 options): Where in life (domain/area)

This creates 1,728 unique combinations (12 × 12 × 12).

## Authentication & Wallet

### Farcaster Quick Auth (IMPORTANT)

The JWT from Farcaster has the FID in the `sub` field (not `fid`):

```typescript
// JWT payload structure
{
  "sub": 6841,           // <-- FID is here!
  "iss": "https://auth.farcaster.xyz",
  "aud": "miniapps.farcaster.xyz",
  "exp": 1747768419
}
```

**Client-side:** Get token and add to fetch headers:
```typescript
import { sdk } from '@/lib/farcaster/sdk'

// Get auth token
const { token } = await sdk.quickAuth.getToken()

// Make authenticated request
const response = await fetch(`${baseUrl}/api/readings`, {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  // ...
})
```

**Server-side:** Parse JWT using Buffer (not atob - browser only):
```typescript
// lib/auth/index.ts
const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
const jsonString = Buffer.from(base64, 'base64').toString('utf-8')
const payload = JSON.parse(jsonString)
const fid = payload.sub  // FID is in 'sub' field
```

### Wallet (Auto-connected)
```typescript
import { farcasterMiniApp } from '@farcaster/miniapp-wagmi-connector'

// Wallet auto-connects via Farcaster client - no picker UI needed
const { isConnected, address } = useAccount()
```

## Data Flow

1. **On Roll:** Upsert user (FK constraint), insert reading with `expires_at = NOW() + 24h`
2. **On AI Purchase:** Daimo Pay processes $2, then generate + save AI reading
3. **On Mint:** Upload metadata to IPFS, mint NFT, set `is_minted = true`
4. **Cleanup:** Delete unminted readings where `expires_at < NOW()`

## Environment Variables

```env
# Database (Neon Postgres)
DATABASE_URL=postgresql://...@neon.tech/neondb

# AI (Claude)
ANTHROPIC_API_KEY=sk-ant-...

# Thirdweb (IPFS storage + contract interaction)
THIRDWEB_CLIENT_ID=...
THIRDWEB_SECRET_KEY=...

# NFT Contract (Base Mainnet)
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x58A2ED2b91Fa02006C8611F155d73ecb6693ECED

# Neynar (Farcaster social features)
NEYNAR_API_KEY=...
```

## Pricing Model

| Tier | Price | Includes |
|------|-------|----------|
| Free Roll | $0 | Dice roll + result + keywords + interpretation guide |
| AI Reading | $2 (USDC via Daimo Pay) | 200-250 word synthesized interpretation |
| Extended Reading | +$1 (USDC) | Additional 150-200 words with reflection prompts |
| Mint | Gas only | NFT on Base (~$0.01-0.05) |

## Current Phase

**Phase 6: Production Polish** - App deployed, fixing remaining issues

### Completed
- [x] Phase 1: Foundation (Farcaster SDK, Wagmi, UI shell)
- [x] Phase 2: Core Loop (Astrodice types, rolling, DB schema)
- [x] Phase 3: AI Integration (Claude readings, streaming display)
- [x] Phase 4: NFT Minting (Thirdweb, IPFS, Base contract)
- [x] Phase 5: Social & Polish (Neynar, community feed, share, collection)
- [x] Farcaster manifest with accountAssociation
- [x] Daimo Pay integration for $2 AI readings
- [x] How It Works modal
- [x] Auth flow (JWT parsing with correct `sub` field)
- [x] Database saving (user upsert before reading insert)

### In Progress / Next Steps
1. **[BLOCKER] NFT Minting Permission** - Grant MINTER_ROLE on Thirdweb contract
   - Contract: `0x58A2ED2b91Fa02006C8611F155d73ecb6693ECED`
   - Grant MINTER_ROLE to `0x0000...0000` (address zero) for public minting
2. **Daimo Pay Production** - Contact Daimo for production appId (currently using `pay-demo`)
3. **Extended Reading UI** - Add +$1 option after AI reading
4. **Reading Detail Page** - Build `/reading/[id]` page

## Deployed Contract

- **Network**: Base Mainnet
- **Contract**: `0x58A2ED2b91Fa02006C8611F155d73ecb6693ECED`
- **Type**: TokenERC721 (Thirdweb)
- **Minting**: Requires MINTER_ROLE (needs to grant to address(0) for public minting)
- **Dashboard**: https://thirdweb.com/base/0x58A2ED2b91Fa02006C8611F155d73ecb6693ECED

## Key Learnings / Gotchas

1. **Farcaster JWT uses `sub` for FID** - Not `fid`. Check official docs.
2. **Use Buffer, not atob** - `atob` is browser-only, server code needs `Buffer.from()`
3. **Foreign key constraints** - Must `upsertUser()` before `createReading()`
4. **Daimo Pay peer deps** - Expects wagmi v2, we use v3. Works but shows warnings.
5. **Manifest limits** - `tagline` max 30 chars, `subtitle` max 30 chars

## Future Ideas

### x402 Agentic Readings API
Fork for pay-per-request API:
- `POST /api/reading` with x402 payment header
- Returns roll + AI interpretation
- For agents/bots to get astrological guidance programmatically

### Offchain Webapp Version
Adapt for standalone web app:
- Replace Farcaster auth with NextAuth.js
- Replace Daimo Pay with Stripe
- Keep core astrodice + AI logic (already modular)

## Key Documents

- `SCRATCHPAD.md` - Session progress and quick reference
- `documentation/onchain-astrodice-prd.md` - Full product requirements
