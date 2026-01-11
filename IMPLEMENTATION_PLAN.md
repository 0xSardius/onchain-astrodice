# Onchain Astrodice - Implementation Plan

**Status:** Ready for Development
**Current State:** Fresh Next.js 16 scaffold (no features implemented)

---

## Directory Structure to Create

```
app/
├── layout.tsx                 # Root layout (update with providers)
├── page.tsx                   # Home screen (question input + roll CTA)
├── globals.css                # Tailwind styles (exists)
├── providers.tsx              # Wagmi + QueryClient providers
├── reading/
│   └── [id]/
│       └── page.tsx           # Individual reading view
├── collection/
│   └── page.tsx               # User's minted + recent readings
├── community/
│   └── page.tsx               # Feed of follows' readings
└── api/
    ├── auth/
    │   └── route.ts           # Verify Farcaster JWT, upsert user
    ├── readings/
    │   ├── route.ts           # GET (list), POST (create roll)
    │   └── [id]/
    │       └── route.ts       # GET single, PATCH (add interpretation)
    ├── ai/
    │   ├── reading/
    │   │   └── route.ts       # Generate base AI reading ($2)
    │   └── extended/
    │       └── route.ts       # Generate extended reading (+$1)
    ├── mint/
    │   └── route.ts           # Prepare NFT metadata, return mint params
    └── community/
        └── route.ts           # Get readings from followed users

components/
├── ui/                        # Base UI components
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   └── loading.tsx
├── dice/
│   ├── dice-roller.tsx        # Main rolling interface
│   ├── dice-animation.tsx     # 3D/2D tumbling animation
│   └── dice-result.tsx        # Planet + Sign + House display
├── reading/
│   ├── reading-card.tsx       # Compact reading display
│   ├── reading-detail.tsx     # Full reading with interpretation
│   ├── interpretation-guide.tsx # Self-interpretation reference
│   └── ai-reading-display.tsx # Formatted AI interpretation
├── nft/
│   ├── nft-preview.tsx        # SVG preview of NFT
│   ├── mint-button.tsx        # Mint CTA with transaction
│   └── nft-visual.tsx         # SVG composition renderer
├── layout/
│   ├── header.tsx             # App header
│   ├── nav.tsx                # Bottom navigation
│   └── cosmic-background.tsx  # Star field background
└── share/
    └── share-button.tsx       # Farcaster share composer

lib/
├── astrodice/
│   ├── types.ts               # Planet, Sign, House types
│   ├── constants.ts           # All 12 planets, signs, houses with meanings
│   ├── roll.ts                # Dice rolling logic
│   └── keywords.ts            # Keywords for each element
├── db/
│   ├── client.ts              # Neon Postgres client
│   ├── schema.ts              # Drizzle/raw schema definitions
│   ├── queries.ts             # Common queries
│   └── migrations/            # SQL migrations
├── farcaster/
│   ├── sdk.ts                 # SDK initialization
│   ├── auth.ts                # Quick Auth helpers
│   └── share.ts               # Compose cast helpers
├── wagmi/
│   ├── config.ts              # Wagmi config with Farcaster connector
│   └── hooks.ts               # Custom transaction hooks
├── nft/
│   ├── metadata.ts            # NFT metadata generation
│   ├── svg.ts                 # SVG composition for visuals
│   └── colors.ts              # Planet color palettes
├── ai/
│   ├── prompts.ts             # Interpretation prompts
│   └── generate.ts            # AI SDK wrapper
└── utils.ts                   # General utilities

types/
├── reading.ts                 # Reading type definitions
├── user.ts                    # User type definitions
└── nft.ts                     # NFT metadata types

public/
├── assets/
│   ├── planets/               # Planet symbols (SVG)
│   ├── signs/                 # Zodiac symbols (SVG)
│   └── houses/                # House glyphs (SVG)
└── og/                        # Open Graph images
```

---

## Phase 1: Foundation

### 1.1 Install Dependencies
```bash
pnpm add @farcaster/miniapp-sdk @farcaster/miniapp-wagmi-connector wagmi viem @tanstack/react-query
```

### 1.2 Configure Wagmi + Farcaster Connector
- Create `app/providers.tsx` with WagmiProvider + QueryClientProvider
- Create `lib/wagmi/config.ts` with Base chain + Farcaster connector
- Update `app/layout.tsx` to wrap with providers

### 1.3 Implement Quick Auth
- Create `lib/farcaster/sdk.ts` - initialize SDK
- Create `lib/farcaster/auth.ts` - getToken() wrapper
- Create `app/api/auth/route.ts` - verify JWT, return user info
- Call `sdk.actions.ready()` after initial load

### 1.4 Create UI Shell
- Create `components/layout/cosmic-background.tsx` - star field
- Create `components/layout/header.tsx` - app header
- Create `components/layout/nav.tsx` - bottom nav (Home, Collection, Community)
- Update `app/page.tsx` - basic home layout with question input
- Add cosmic color palette to Tailwind config

### 1.5 Create farcaster.json Manifest
```json
{
  "accountAssociation": { ... },
  "frame": {
    "version": "1",
    "name": "Onchain Astrodice",
    "iconUrl": "https://astrodice.xyz/icon.png",
    "homeUrl": "https://astrodice.xyz",
    "splashImageUrl": "https://astrodice.xyz/splash.png",
    "splashBackgroundColor": "#0a0a1a"
  }
}
```

---

## Phase 2: Core Loop

### 2.1 Define Astrodice Types & Constants
- Create `lib/astrodice/types.ts`:
  ```typescript
  type Planet = 'Sun' | 'Moon' | 'Mercury' | ... | 'South Node'
  type Sign = 'Aries' | 'Taurus' | ... | 'Pisces'
  type House = 1 | 2 | 3 | ... | 12
  ```
- Create `lib/astrodice/constants.ts` - all 36 elements with meanings/keywords
- Create `lib/astrodice/roll.ts` - random selection logic

### 2.2 Build Dice Rolling UI
- Create `components/dice/dice-roller.tsx` - question input + roll button
- Create `components/dice/dice-animation.tsx` - tumbling animation (2-3s)
- Create `components/dice/dice-result.tsx` - display Planet + Sign + House

### 2.3 Create Result Screen
- Create `components/reading/reading-detail.tsx` - full result display
- Create `components/reading/interpretation-guide.tsx` - expandable reference
- Add CTAs: "Get AI Reading $2" | "Mint Reading" | "Ask Again"

### 2.4 Set Up Database
```bash
pnpm add @neondatabase/serverless drizzle-orm
```
- Create `lib/db/client.ts` - Neon connection
- Create `lib/db/schema.ts` - users + readings tables
- Run migration to create tables

### 2.5 Reading CRUD API
- Create `app/api/readings/route.ts`:
  - POST: Create new reading (store roll result)
  - GET: List user's readings
- Create `app/api/readings/[id]/route.ts`:
  - GET: Single reading
  - PATCH: Update with interpretation/mint status

---

## Phase 3: AI Integration

### 3.1 Set Up AI SDK
```bash
pnpm add ai @ai-sdk/anthropic
```
- Create `lib/ai/prompts.ts` - base and extended reading prompts
- Create `lib/ai/generate.ts` - streaming generation wrapper

### 3.2 Payment Flow
- Create payment verification (ETH/USDC on Base)
- Integrate with Wagmi sendTransaction
- Store payment status on reading record

### 3.3 AI Reading API
- Create `app/api/ai/reading/route.ts`:
  - Verify $2 payment
  - Generate 200-250 word interpretation
  - Store on reading record
  - Return streamed response

### 3.4 Extended Reading API
- Create `app/api/ai/extended/route.ts`:
  - Verify +$1 payment
  - Generate additional 150-200 words
  - Add reflection questions
  - Update reading record

### 3.5 AI Reading UI
- Create `components/reading/ai-reading-display.tsx` - formatted interpretation
- Add payment button with transaction flow
- Show loading state during generation

---

## Phase 4: NFT & Minting

### 4.1 Deploy NFT Contract
- Set up Thirdweb account
- Deploy ERC-721 contract on Base
- Configure minting permissions

### 4.2 NFT Visual System
```bash
pnpm add thirdweb
```
- Create `lib/nft/colors.ts` - 12 planet color palettes
- Create `lib/nft/svg.ts` - SVG composition logic
- Create `components/nft/nft-visual.tsx` - render NFT preview

### 4.3 Metadata Generation
- Create `lib/nft/metadata.ts` - generate JSON metadata
- Set up IPFS upload (Thirdweb storage or Pinata)
- Create `app/api/mint/route.ts` - prepare metadata, return mint params

### 4.4 Mint Flow UI
- Create `components/nft/nft-preview.tsx` - show before mint
- Create `components/nft/mint-button.tsx` - transaction + confirmation
- Update reading record on successful mint

---

## Phase 5: Social & Polish

### 5.1 Neynar Integration
```bash
pnpm add @neynar/nodejs-sdk
```
- Create Neynar client wrapper
- Fetch user's following list
- Query readings from followed users

### 5.2 Community Feed
- Create `app/api/community/route.ts` - get follows' readings
- Create `app/community/page.tsx` - feed UI
- Show username, question snippet, result

### 5.3 Share Flow
- Create `lib/farcaster/share.ts` - compose cast helper
- Create `components/share/share-button.tsx` - trigger composer
- Generate share image/card

### 5.4 Collection View
- Create `app/collection/page.tsx` - user's readings
- Section: Minted (permanent)
- Section: Recent (unminted, <24h)

### 5.5 Polish
- Loading states everywhere
- Error handling and toasts
- Responsive design tweaks
- Animation polish

---

## Phase 6: Launch Prep

### 6.1 Analytics
- Add basic event tracking (rolls, conversions, mints)
- Implement success metrics dashboard

### 6.2 Performance
- Optimize images and SVGs
- Add caching where appropriate
- Test on mobile devices

### 6.3 Miniapp Submission
- Finalize farcaster.json
- Test in Warpcast/Base App
- Submit for review

### 6.4 Launch
- Prepare marketing assets
- Coordinate launch timing
- Monitor and fix issues

---

## Environment Variables Needed

```env
# Farcaster
NEXT_PUBLIC_FARCASTER_HEADER=...

# Database
DATABASE_URL=postgresql://...@neon.tech/astrodice

# AI
ANTHROPIC_API_KEY=sk-ant-...

# Blockchain
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
THIRDWEB_SECRET_KEY=...
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x...

# Neynar (already have)
NEYNAR_API_KEY=CA2E8A71-29A2-4B0F-9376-717F506E85F9

# IPFS
IPFS_API_KEY=...
```

---

## Quick Start for Next Session

Start with Phase 1.1:
```bash
pnpm add @farcaster/miniapp-sdk @farcaster/miniapp-wagmi-connector wagmi viem @tanstack/react-query
```

Then proceed to 1.2 (Wagmi config) and work through sequentially.
