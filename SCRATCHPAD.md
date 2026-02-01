# Development Scratchpad

Progress tracking for Onchain Astrodice development.

---

## Current Status: Phase 6 - Production Polish

### Deployed
- **Live URL**: https://onchain-astrodice.vercel.app
- **Farcaster Manifest**: Complete with accountAssociation
- **Contract**: Base mainnet `0x58A2ED2b91Fa02006C8611F155d73ecb6693ECED`

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

### 5.1 Neynar Integration (COMPLETE)
- [x] Install `@neynar/nodejs-sdk`
- [x] Create `lib/neynar/client.ts` (API client)
- [x] Create `lib/neynar/queries.ts` (follows, user lookup)
- [x] Create `/api/community/route.ts` (follows' readings feed)

### 5.2 Community Page (COMPLETE)
- [x] Create `app/community/page.tsx`
- [x] Build feed component showing follows' readings
- [ ] Add filtering (recent, popular, by sign/planet)
- [ ] Pagination or infinite scroll

### 5.3 Share Flow (COMPLETE)
- [x] Create `components/share/share-button.tsx`
- [x] Integrate Farcaster composer SDK (using existing composeCast)
- [x] Generate share text with reading summary
- [x] Wire up ShareButton in result view

### 5.4 Collection View (COMPLETE)
- [x] Create `/api/collection/route.ts`
- [x] Create CollectionCard component (NFT visual + details)
- [x] Create CollectionGrid component (loading/error/empty states)
- [x] Update `app/collection/page.tsx` with real data
- [x] Link to OpenSea/Basescan

### 5.5 Polish & Error Handling (COMPLETE)
- [x] Add toast notification system (ToastProvider, useToast hook)
- [x] Integrate toasts into MintButton and ShareButton
- [x] Error boundary for graceful failures
- [x] Mobile responsiveness audit
- [x] Safe area insets for iOS devices

## Phase 6 - Production Polish (IN PROGRESS)

### 6.1 Farcaster Manifest (COMPLETE)
- [x] Update manifest URLs to production domain
- [x] Add accountAssociation from Warpcast Developer Tools
- [x] Generate PNG assets (icon, splash, og-image)
- [x] Add `fc:miniapp` meta tag to layout
- [x] Deploy and verify in Warpcast

### 6.2 Daimo Pay Production (TODO)
- [ ] Register app at pay.daimo.com for production appId
- [ ] Verify treasury address to remove "untrusted" warning
- [ ] Update `appId` in `components/reading/ai-reading-display.tsx`
- Current: Using `pay-demo` appId (shows untrusted warning)

### 6.3 Reading Detail Page (TODO)
- [ ] Build `/reading/[id]` page
- [ ] Show full reading with AI text, NFT visual, metadata
- [ ] Add share/mint actions if not already done
- [ ] Link from collection and community feeds

### 6.4 Extended Reading UI (TODO)
- [ ] Add "+$1 Extended Reading" option after AI reading
- [ ] Wire up `/api/ai/extended` route
- [ ] Display extended content below base reading

### 6.5 Community Feed Polish (TODO)
- [ ] Test Neynar API integration end-to-end
- [ ] Add error recovery / retry logic
- [ ] Add filtering (by sign/planet/house)
- [ ] Add pagination or infinite scroll

### 6.6 Backend Hardening (TODO)
- [ ] Add payment verification before AI generation
- [ ] Set up expired reading cleanup (cron or Vercel function)
- [ ] Add rate limiting to API routes
- [ ] Improve error handling and logging

---

## Session Log

### 2026-01-31
- **Auth Fixes for API Calls:**
  - Identified issue: API calls returning 401 because no auth token was being sent
  - Updated all client-side fetches to use `sdk.quickAuth.fetch()`:
    - `app/page.tsx` - /api/readings POST (save roll)
    - `components/nft/mint-button.tsx` - /api/mint POST/PATCH
    - `app/community/page.tsx` - /api/community GET
    - `app/collection/page.tsx` - /api/collection GET
- **Added How It Works Modal:**
  - Created `components/ui/how-it-works-modal.tsx`
  - Explains astrodice system (Planet/Sign/House meanings)
  - Shows user journey and pricing breakdown
  - Added to home page below CTA
- **Daimo Pay Status:**
  - Registration requires team outreach (not self-service)
  - Using `pay-demo` appId for now (shows untrusted warning)
  - Payment flow works, just has warning banner
- **Known Issue (IN PROGRESS):**
  - "Saving..." button still stuck after roll
  - `sdk.quickAuth.fetch()` may be failing silently
  - Need to investigate auth flow in Farcaster context

### 2026-01-29
- **Farcaster Manifest Complete:**
  - Updated all URLs to `onchain-astrodice.vercel.app`
  - Added accountAssociation from Warpcast Developer Tools
  - Shortened subtitle to 30 chars ("Roll dice, divine destiny")
  - Generated PNG assets from SVGs (icon, splash, og-image)
  - Added `fc:miniapp` meta tag and OpenGraph image to layout
  - Created `scripts/convert-images.mjs` for future asset updates
  - Deployed and verified working in Warpcast
- **Reviewed User Flow:**
  - Core loop (question → roll → AI → mint → share) fully functional
  - Identified gaps: Daimo Pay production setup, reading detail page, extended reading UI
  - Added Phase 6 tasks to scratchpad

### 2026-01-18
- Verified mint flow working via API testing
- Updated CLAUDE.md with current project state
- Expanded Phase 5 tasks with detailed sub-tasks
- **Phase 5.1 Complete:** Neynar SDK integration
  - Installed @neynar/nodejs-sdk
  - Created lib/neynar/client.ts (lazy init pattern)
  - Created lib/neynar/queries.ts (follows, user lookup)
  - Created /api/community/route.ts (follows' minted readings)
- **Phase 5.2 Complete:** Community page
  - Created ReadingCard component (user info + roll display)
  - Created ReadingFeed component (loading, error, empty states)
  - Updated app/community/page.tsx with real feed
- **Phase 5.3 Complete:** Share flow
  - Created ShareButton component with share text generation
  - Integrated with Farcaster composeCast
  - Added to result view in home page
- **Phase 5.4 Complete:** Collection view
  - Created /api/collection route for user's minted readings
  - Built CollectionCard with NFT visual + OpenSea/Basescan links
  - Built CollectionGrid with loading/error/empty states
  - Updated collection page with stats and grid
- **Phase 5.5 Complete:** Polish & error handling
  - Added ToastProvider and useToast hook
  - Integrated toasts into MintButton and ShareButton
  - Added ErrorBoundary component wrapping the app
  - Added safe area insets for iOS devices
  - Toast animation with slide-up effect

### 2026-01-28
- **Build Fixes for Vercel Deployment:**
  - Fixed Neynar `Follower` type error - access `follow.user.fid` instead of `follow.fid`
  - Fixed Daimo Pay chain configuration error - use `getDefaultConfig` from `@daimo/pay`
  - Wagmi config now uses Daimo's automatic chain setup (includes HyperEVM, Monad, World Chain)
  - Build currently in progress on Vercel (commit `45a97e3`)

- **Remaining Manifest Issues (TODO next session):**
  - `public/.well-known/farcaster.json` has placeholder values:
    - `accountAssociation` needs real values from Warpcast Developer Tools
    - URLs need to change from `YOUR_DOMAIN` to `onchain-astrodice.vercel.app`
  - Missing image assets in `public/`:
    - `icon.png` (200x200px) - app icon
    - `splash.png` (200x200px) - splash screen
    - `og-image.png` (1200x630px) - social embeds
  - Missing `fc:miniapp` meta tag in `app/layout.tsx` for rich Farcaster embeds

- **Next Steps After Build Passes:**
  1. Create cosmic-themed image assets
  2. Update manifest with real domain URLs
  3. Get `accountAssociation` from https://farcaster.xyz/~/developers/mini-apps/manifest
  4. Add `fc:miniapp` embed meta tag
  5. Test in Warpcast preview tool

### 2026-01-25
- **Payment Integration:** Daimo Pay
  - Installed @daimo/pay SDK
  - Added DaimoPayProvider to app providers
  - Updated AiReadingDisplay with payment flow
  - Users now pay $2 USDC before AI reading generates
  - Using pay-demo appId (switch to production later)
  - Treasury: 0x626522B58b92dAF53596F1378bd25B7653c1fC49
- **Farcaster Manifest:** Created
  - public/.well-known/farcaster.json (needs accountAssociation)
  - public/icon.svg (convert to PNG for production)
  - public/splash.svg (convert to PNG for production)

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
- **Payment:** Daimo Pay integration (pay-demo mode)
  - Users pay $2 USDC on Base before AI reading
  - Update TREASURY_ADDRESS in components/reading/ai-reading-display.tsx
  - Get production appId at pay.daimo.com

---

## Future: x402 Agentic Readings API

Fork this project to create a pay-per-request API for agentic readings:
- Endpoint: `POST /api/reading` with x402 payment
- Input: question (optional)
- Output: roll + AI interpretation
- Use case: Agents/bots can get astrological guidance programmatically
- Core logic already modular: `rollAstrodice()`, `streamBaseReading()`, prompts

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
