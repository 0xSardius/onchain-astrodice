# Development Scratchpad

Progress tracking for Onchain Astrodice development.

---

## Current Status: Phase 4 Complete

### Test the App
Dev server: http://localhost:3000
1. Enter a question
2. Click "Cast the Dice"
3. View result with keywords
4. Click "Get AI Reading" to generate streaming interpretation
5. Click "Mint Reading" to preview NFT and mint on Base

### Minting Verified
- [x] SVG generation working (planet colors, sign patterns, house glyphs)
- [x] IPFS upload working (Thirdweb Storage)
- [x] Metadata generation working (OpenSea-compliant)
- [x] Contract deployed and configured on Base

---

## Phase 1 - Foundation (COMPLETE)
- [x] Project scaffold (Next.js 16, TypeScript, Tailwind v4)
- [x] Farcaster SDK + Wagmi + providers
- [x] Cosmic UI shell (background, header, nav)
- [x] Home screen with question input

## Phase 2 - Core Loop (COMPLETE)
- [x] Astrodice types, constants (36 elements)
- [x] Dice rolling logic + animation
- [x] Result display with keywords
- [x] InterpretationGuide component
- [x] Database schema (Drizzle + Neon)
- [x] Reading CRUD API routes

## Phase 3 - AI Integration (COMPLETE)
- [x] Install ai + @ai-sdk/anthropic
- [x] Create lib/ai/prompts.ts (system + reading prompts)
- [x] Create lib/ai/generate.ts (streaming generation)
- [x] Create /api/ai/reading (with DB, for production)
- [x] Create /api/ai/extended (with DB, for production)
- [x] Create /api/ai/generate (direct, for testing)
- [x] Create AiReadingDisplay component
- [x] Wire up streaming AI reading in result view

## Phase 4 - NFT & Minting (COMPLETE)
- [x] Install thirdweb SDK
- [x] Create NFT visual system (SVG composition)
  - Planet color palettes (12 gradients)
  - Sign geometric patterns (12 borders)
  - House symbolic glyphs (12 center elements)
- [x] Generate metadata for IPFS (Thirdweb Storage)
- [x] Create mint transaction flow with Wagmi
- [x] Wire up MintButton component
- [x] Deploy TokenERC721 contract on Base
  - Contract: `0x58A2ED2b91Fa02006C8611F155d73ecb6693ECED`
  - Public minting enabled (MINTER_ROLE granted to everyone)

## Phase 5 - Social & Polish (NEXT)

### 5.1 Neynar Integration
- [ ] Install `@neynar/nodejs-sdk`
- [ ] Create `lib/neynar/client.ts` (API client)
- [ ] Create `lib/neynar/queries.ts` (follows, user lookup)
- [ ] Create `/api/community/route.ts` (follows' readings feed)

### 5.2 Community Page
- [ ] Create `app/community/page.tsx`
- [ ] Build feed component showing follows' readings
- [ ] Add filtering (recent, popular, by sign/planet)
- [ ] Pagination or infinite scroll

### 5.3 Share Flow
- [ ] Create `components/share/share-button.tsx`
- [ ] Integrate Farcaster composer SDK
- [ ] Generate share text with reading summary
- [ ] Include NFT image if minted

### 5.4 Collection View
- [ ] Create `app/collection/page.tsx`
- [ ] Display user's minted NFTs
- [ ] Show reading details on click
- [ ] Link to OpenSea/Basescan

### 5.5 Polish & Error Handling
- [ ] Add loading states throughout
- [ ] Error boundaries for graceful failures
- [ ] Toast notifications for actions
- [ ] Mobile responsiveness audit
- [ ] Accessibility improvements

---

## Session Log

### 2026-01-18
- Verified mint flow working via API testing
- Updated CLAUDE.md with current project state
- Expanded Phase 5 tasks with detailed sub-tasks
- Ready to begin social features

### 2026-01-14
- **Phase 4 Complete:**
  - Installed thirdweb SDK for IPFS storage and minting
  - Created deterministic NFT visual system (SVG composition)
  - Built 12 planet palettes, 12 sign patterns, 12 house glyphs
  - Added metadata generation with Thirdweb IPFS upload
  - Created MintButton with Wagmi transaction handling
  - Wired up mint flow in home page
  - Readings now save to DB on roll for minting

### 2026-01-13
- **Phase 3 Complete:**
  - Installed AI SDK with Anthropic provider
  - Created interpretation prompts with astrological guidance
  - Built streaming text generation with Claude claude-sonnet-4-20250514
  - Created 3 AI API routes (reading, extended, generate)
  - Built AiReadingDisplay component with streaming UI
  - Integrated into home page result view

### 2026-01-12
- Fixed lint warnings, verified build
- Configured environment variables

### 2026-01-11
- Phase 1 & 2 complete

---

## Files to Create (Phase 5)

```
lib/neynar/
├── client.ts           # Neynar API client
├── queries.ts          # Follows, user lookup
└── index.ts            # Barrel export

app/
├── community/page.tsx  # Follows' readings feed
└── collection/page.tsx # User's minted NFTs

components/
├── share/
│   └── share-button.tsx  # Farcaster composer
└── community/
    ├── reading-feed.tsx  # Feed list component
    └── reading-card.tsx  # Individual reading card

app/api/community/
└── route.ts            # GET follows' readings
```

---

## Files Created (Phase 3)

```
lib/ai/
├── prompts.ts          # System + reading prompts
├── generate.ts         # Streaming generation functions
└── index.ts            # Barrel export

app/api/ai/
├── reading/route.ts    # Base reading with DB ($2)
├── extended/route.ts   # Extended reading with DB (+$1)
└── generate/route.ts   # Direct generation (testing)

components/reading/
└── ai-reading-display.tsx  # Streaming AI display
```

## Files Created (Phase 4)

```
lib/nft/
├── colors.ts           # 12 planet color palettes
├── patterns.ts         # 12 sign SVG border patterns
├── glyphs.ts           # 12 house symbolic glyphs
├── svg.ts              # SVG composition logic
├── metadata.ts         # IPFS upload + metadata generation
└── index.ts            # Barrel export

components/nft/
├── nft-visual.tsx      # SVG renderer component
├── nft-preview.tsx     # Mint preview modal
├── mint-button.tsx     # Transaction handler
└── index.ts            # Barrel export

app/api/mint/
└── route.ts            # POST (prepare) + PATCH (confirm)

types/
└── nft.ts              # NFT type definitions
```

---

## API Routes Summary

| Route | Method | Purpose |
|-------|--------|---------|
| /api/auth | POST | Verify JWT, upsert user |
| /api/readings | GET | List user's readings |
| /api/readings | POST | Create new reading |
| /api/readings/[id] | GET | Get single reading |
| /api/readings/[id] | PATCH | Update reading |
| /api/ai/generate | POST | Generate AI reading (testing) |
| /api/ai/reading | POST | Generate + save AI reading ($2) |
| /api/ai/extended | POST | Generate extended reading (+$1) |
| /api/mint | POST | Prepare metadata, upload to IPFS |
| /api/mint | PATCH | Update DB after successful mint |

---

## Environment Variables

```env
NEYNAR_API_KEY=✓ configured
DATABASE_URL=✓ configured (Neon Postgres)
ANTHROPIC_API_KEY=✓ configured
THIRDWEB_CLIENT_ID=✓ configured
THIRDWEB_SECRET_KEY=✓ configured
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=✓ 0x58A2ED2b91Fa02006C8611F155d73ecb6693ECED
```

---

## Quick Commands

```bash
pnpm dev      # Start dev server
pnpm build    # Production build
pnpm lint     # ESLint check
```

---

## Notes
- AI readings use Claude claude-sonnet-4-20250514 (best quality/cost)
- Streaming responses for real-time display
- /api/ai/generate works without database (for testing)
- /api/ai/reading and /api/ai/extended require database + auth
- Payment verification TODO in production routes

---

## Future: Offchain Webapp Version

This codebase can serve as a foundation for a standalone web app (non-Farcaster):
- Core astrodice logic (`lib/astrodice/`) is framework-agnostic
- AI reading system (`lib/ai/`) works independently
- UI components can be adapted for general web use
- Remove Farcaster SDK/Wagmi dependencies for simpler auth (email, OAuth, etc.)
- Database schema and API routes are reusable

**Potential adaptations:**
- Replace Farcaster Quick Auth with NextAuth.js or similar
- Swap wallet-based payments for Stripe
- Keep NFT minting optional or remove entirely
- Add traditional user accounts
