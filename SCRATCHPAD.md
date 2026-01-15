# Development Scratchpad

Progress tracking for Onchain Astrodice development.

---

## Current Status: Phase 3 Complete

### Test the App
Dev server: http://localhost:3000
1. Enter a question
2. Click "Cast the Dice"
3. View result with keywords
4. Click "Get AI Reading" to generate streaming interpretation

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

## Phase 4 - NFT & Minting (NEXT)
- [ ] Deploy Thirdweb contract on Base
- [ ] Create NFT visual system (SVG composition)
- [ ] Generate metadata for IPFS
- [ ] Create mint transaction flow
- [ ] Wire up "Mint Reading" button

---

## Session Log

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

---

## Environment Variables

```env
NEYNAR_API_KEY=✓ configured
DATABASE_URL=✓ configured (Neon Postgres)
ANTHROPIC_API_KEY=✓ configured
```

---

## Quick Commands

```bash
pnpm dev      # Start dev server
pnpm build    # Production build
pnpm lint     # ESLint check
```

---

## Phase 4 Dependencies (next)

```bash
pnpm add thirdweb
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
