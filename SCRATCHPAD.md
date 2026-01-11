# Development Scratchpad

Progress tracking for Onchain Astrodice development.

---

## Current Phase: 1 - Foundation (COMPLETE)

### Completed
- [x] Project scaffold (Next.js 16, TypeScript, Tailwind v4)
- [x] CLAUDE.md with development guidance
- [x] IMPLEMENTATION_PLAN.md with 6-phase roadmap
- [x] PRD finalized (550 lines)
- [x] Install Farcaster SDK + Wagmi dependencies
- [x] Create app/providers.tsx (Wagmi + QueryClient)
- [x] Create lib/wagmi/config.ts (Base chain + Farcaster connector)
- [x] Create lib/farcaster/sdk.ts (SDK initialization)
- [x] Create lib/farcaster/auth.ts (Quick Auth + composeCast helpers)
- [x] Create cosmic UI shell (background, header, nav)
- [x] Update app/page.tsx with home screen (question input + roll CTA)
- [x] Create placeholder pages (collection, community)
- [x] Build passes successfully

### Ready for Phase 2
Phase 2: Core Loop
- Dice rolling logic (client-side RNG)
- Result display with keywords
- Self-interpretation guide component
- Neon Postgres setup and schema
- Reading CRUD operations

---

## Session Log

### 2026-01-11
- Reviewed codebase state (fresh scaffold, no features)
- Created IMPLEMENTATION_PLAN.md
- Updated CLAUDE.md with comprehensive guidance
- Committed and pushed documentation
- **Phase 1 Implementation:**
  - Installed: @farcaster/miniapp-sdk, wagmi, viem, @tanstack/react-query
  - Created wagmi config with Base chain + farcasterFrame connector
  - Created providers.tsx with WagmiProvider + QueryClientProvider
  - Created Farcaster SDK helpers (sdk.ts, auth.ts)
  - Built cosmic UI: animated star background, header, bottom nav
  - Updated layout.tsx with providers, metadata, viewport config
  - Created home page with question input + "Cast the Dice" CTA
  - Added placeholder pages for /collection and /community
  - Fixed SDK type issues (quickAuth is standalone export, embeds is tuple)
  - Build verified passing

---

## Files Created This Session

```
app/
├── providers.tsx           # Wagmi + QueryClient providers
├── collection/page.tsx     # Placeholder
├── community/page.tsx      # Placeholder
├── layout.tsx              # Updated with providers + layout
└── page.tsx                # Home screen with question input

lib/
├── wagmi/config.ts         # Base chain + Farcaster connector
└── farcaster/
    ├── sdk.ts              # SDK initialization
    └── auth.ts             # Quick Auth + share helpers

components/layout/
├── cosmic-background.tsx   # Animated star field canvas
├── header.tsx              # App header with wallet address
└── nav.tsx                 # Bottom navigation
```

---

## Quick Reference

### Commands
```bash
pnpm dev      # Dev server
pnpm build    # Production build
pnpm lint     # Lint check
```

### Phase 2 Dependencies (next)
```bash
pnpm add @neondatabase/serverless drizzle-orm
```

---

## Decisions Made
- Using Anthropic Claude for AI readings (via Vercel AI SDK)
- Neon Postgres for database
- Thirdweb for NFT minting
- Base L2 for all transactions
- quickAuth is standalone export from @farcaster/miniapp-sdk
- Embeds for composeCast expects tuple [string] or [string, string]

## Open Questions
- Exact AI model (Claude Sonnet vs GPT-4) - leaning Claude
- NFT collection name/branding
- Launch date target

## Notes
- Neynar MCP available for reference
- Neynar API key already in .env
- Peer dependency warnings for @wagmi/core and typescript versions (non-blocking)
