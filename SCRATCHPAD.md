# Development Scratchpad

Progress tracking for Onchain Astrodice development.

---

## Current Phase: 2 - Core Loop (COMPLETE)

### Phase 1 - Foundation (COMPLETE)
- [x] Project scaffold (Next.js 16, TypeScript, Tailwind v4)
- [x] CLAUDE.md + IMPLEMENTATION_PLAN.md
- [x] Farcaster SDK + Wagmi dependencies
- [x] Providers, wagmi config, Farcaster auth helpers
- [x] Cosmic UI shell (background, header, nav)
- [x] Home screen with question input

### Phase 2 - Core Loop (COMPLETE)
- [x] Install Neon + Drizzle ORM
- [x] Astrodice types (Planet, Sign, House)
- [x] Constants with all 36 elements + meanings/keywords
- [x] Secure random dice rolling logic
- [x] DiceAnimation component (bouncing symbols)
- [x] DiceResult component (keywords display)
- [x] InterpretationGuide expandable component
- [x] Full rolling flow in home page
- [x] Database schema (users, readings tables)
- [x] Lazy DB client (avoids build-time errors)
- [x] Reading CRUD API routes
- [x] Auth API route

### Ready for Phase 3
Phase 3: AI Integration
- Vercel AI SDK setup
- Interpretation prompt engineering
- Base reading generation ($2)
- Extended reading generation (+$1)
- Payment flow (ETH/USDC on Base)

---

## Session Log

### 2026-01-11
- **Phase 1:** Foundation complete
- **Phase 2:** Core Loop complete
  - Created lib/astrodice/ with types, constants (36 elements), roll logic
  - Built dice UI: DiceAnimation, DiceResult, InterpretationGuide
  - Updated home page with full roll flow (input → animation → result)
  - Created lib/db/ with Drizzle schema, lazy client, queries
  - Created API routes: /api/auth, /api/readings, /api/readings/[id]
  - Fixed lazy DB initialization for build compatibility

---

## Files Created (Phase 2)

```
lib/astrodice/
├── types.ts            # Planet, Sign, House, AstrodiceRoll types
├── constants.ts        # 12 planets, 12 signs, 12 houses with meanings
├── roll.ts             # Secure random dice rolling
└── index.ts            # Barrel export

lib/db/
├── schema.ts           # Drizzle schema (users, readings)
├── client.ts           # Lazy Neon connection
├── queries.ts          # CRUD operations
├── index.ts            # Barrel export
└── migrations/
    └── 0001_initial.sql

components/dice/
├── dice-animation.tsx  # Rolling animation
└── dice-result.tsx     # Result display with keywords

components/reading/
└── interpretation-guide.tsx  # Expandable meanings guide

app/api/
├── auth/route.ts           # POST - verify JWT, upsert user
├── readings/route.ts       # GET/POST - list/create readings
└── readings/[id]/route.ts  # GET/PATCH - single reading ops
```

---

## Quick Reference

### Commands
```bash
pnpm dev      # Dev server
pnpm build    # Production build
pnpm lint     # Lint check
```

### Phase 3 Dependencies (next)
```bash
pnpm add ai @ai-sdk/anthropic
```

### Environment Variables Needed
```env
DATABASE_URL=postgresql://...@neon.tech/astrodice
ANTHROPIC_API_KEY=sk-ant-...  # For Phase 3
```

---

## Commits This Session
1. `a216d05` - Add implementation plan and project documentation
2. `4aa4d38` - Implement Phase 1: Foundation
3. `9d90170` - Add astrodice core system (types, constants, roll logic)
4. `80b9099` - Add dice rolling UI with animation and result display
5. `593f5f5` - Add Neon Postgres database schema and queries
6. `4776cc5` - Add reading API routes with auth verification

---

## Decisions Made
- Anthropic Claude for AI readings (via Vercel AI SDK)
- Neon Postgres for database (serverless)
- Drizzle ORM for type-safe queries
- Thirdweb for NFT minting
- Base L2 for all transactions
- Lazy DB initialization to avoid build errors
- Secure random via crypto.getRandomValues()

## Notes
- Neynar MCP available for reference
- Neynar API key in .env
- DATABASE_URL needed before running API routes
- Run migrations/0001_initial.sql on Neon console
