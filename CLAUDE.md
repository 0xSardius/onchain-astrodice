# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Onchain Astrodice is a Farcaster miniapp that generates astrological readings using the astrodice system (Planet + Sign + House), with AI-powered interpretation and NFT collectibility on Base. Users can roll dice, get AI readings ($2), and mint readings as NFTs.

**Current State:** Fresh Next.js 16 scaffold - no features implemented yet. See `IMPLEMENTATION_PLAN.md` for phased development roadmap.

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

### Dependencies to Install (Phase 1)
```bash
pnpm add @farcaster/miniapp-sdk @farcaster/miniapp-wagmi-connector wagmi viem @tanstack/react-query
```

### Dependencies to Install (Later Phases)
```bash
# Phase 2 - Database
pnpm add @neondatabase/serverless drizzle-orm

# Phase 3 - AI
pnpm add ai @ai-sdk/anthropic

# Phase 4 - NFT
pnpm add thirdweb

# Phase 5 - Social
pnpm add @neynar/nodejs-sdk
```

## Directory Structure

```
app/
├── layout.tsx              # Root layout (wrap with providers)
├── page.tsx                # Home - question input + roll CTA
├── providers.tsx           # Wagmi + QueryClient providers
├── reading/[id]/page.tsx   # Individual reading view
├── collection/page.tsx     # User's readings
├── community/page.tsx      # Follows' readings feed
└── api/
    ├── auth/route.ts       # Verify Farcaster JWT
    ├── readings/           # CRUD for readings
    ├── ai/                 # AI reading generation
    ├── mint/route.ts       # NFT minting prep
    └── community/route.ts  # Social feed

components/
├── ui/                     # Base UI (button, input, card)
├── dice/                   # Rolling interface + animation
├── reading/                # Reading display components
├── nft/                    # NFT preview + mint
├── layout/                 # Header, nav, background
└── share/                  # Farcaster share

lib/
├── astrodice/              # Types, constants, roll logic
├── db/                     # Neon Postgres client + queries
├── farcaster/              # SDK, auth, share helpers
├── wagmi/                  # Config + hooks
├── nft/                    # Metadata, SVG generation
└── ai/                     # Prompts + generation

types/                      # TypeScript definitions
```

## Core Mechanics

The astrodice system uses three 12-sided conceptual dice:
- **Planet** (12 options): What energy/action is happening
- **Sign** (12 options): How it manifests (style/approach)
- **House** (12 options): Where in life (domain/area)

This creates 1,728 unique combinations (12 × 12 × 12).

### Planets
Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto, North Node, South Node

### Signs
Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, Pisces

### Houses
1 (Self), 2 (Resources), 3 (Communication), 4 (Home), 5 (Creativity), 6 (Work/Health), 7 (Relationships), 8 (Transformation), 9 (Philosophy), 10 (Career), 11 (Community), 12 (Unconscious)

## Authentication & Wallet

### Farcaster Quick Auth
```typescript
import sdk from '@farcaster/miniapp-sdk'

// Get auth token (contains FID)
const { token } = await sdk.quickAuth.getToken()

// Authenticated API calls
await sdk.quickAuth.fetch(`${API}/readings`)

// Signal app ready (hides splash)
await sdk.actions.ready()
```

### Wallet (Auto-connected)
```typescript
import { farcasterMiniApp } from '@farcaster/miniapp-wagmi-connector'

// Wallet auto-connects via Farcaster client - no picker UI needed
const { isConnected, address } = useAccount()
const { sendTransaction } = useSendTransaction()
```

## Data Flow

1. **On Roll:** Insert reading with `expires_at = NOW() + 24h`
2. **On AI Purchase:** Update reading with `ai_reading` text
3. **On Mint:** Set `is_minted = true`, store `token_id`, `tx_hash`
4. **Cleanup:** Delete unminted readings where `expires_at < NOW()`

## NFT Visual System

Deterministic SVG composition based on roll:
- **Background gradient**: Planet color palette (12 options)
- **Border pattern**: Sign geometric pattern (12 options)
- **Central glyph**: House symbol (12 options)
- **Typography**: Standard (free) vs Ornate (AI reading purchased)

## Development Patterns

### API Routes
```typescript
// app/api/readings/route.ts
export async function POST(request: Request) {
  // 1. Verify auth via Farcaster JWT
  // 2. Parse request body
  // 3. Insert to database
  // 4. Return result
}
```

### Component Structure
```typescript
// components/dice/dice-roller.tsx
'use client'

export function DiceRoller({ onRoll }: Props) {
  // State for question input
  // Animation state
  // Roll handler
}
```

### Database Queries (Neon)
```typescript
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)
const readings = await sql`SELECT * FROM readings WHERE user_fid = ${fid}`
```

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://...@neon.tech/astrodice

# AI
ANTHROPIC_API_KEY=sk-ant-...

# Blockchain
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
THIRDWEB_SECRET_KEY=...
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x...

# Neynar (exists)
NEYNAR_API_KEY=CA2E8A71-29A2-4B0F-9376-717F506E85F9
```

## Pricing Model

| Tier | Price | Includes |
|------|-------|----------|
| Free Roll | $0 | Dice roll + result + keywords + self-interpretation guide |
| AI Reading | $2 (ETH/USDC) | 200-250 word synthesized interpretation |
| Extended Reading | +$1 (ETH/USDC) | Additional 150-200 words with reflection prompts |
| Mint | Gas only | NFT on Base (~$0.01-0.05) |

## Key Documents

- `documentation/onchain-astrodice-prd.md` - Full product requirements (550 lines)
- `IMPLEMENTATION_PLAN.md` - Phased development roadmap

## Current Phase

**Phase 1: Foundation** - Install dependencies, configure Wagmi/Farcaster, create UI shell

Next steps:
1. Install Farcaster SDK and Wagmi dependencies
2. Create `app/providers.tsx` with provider setup
3. Create `lib/wagmi/config.ts` with Base chain config
4. Implement Quick Auth flow
5. Build cosmic-themed UI shell
