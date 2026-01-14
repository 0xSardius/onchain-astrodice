# Development Scratchpad

Progress tracking for Onchain Astrodice development.

---

## Current Status: Testing Phase 2

### Test Results (2026-01-12)
- [x] **Lint**: Clean (0 errors, 0 warnings)
- [x] **Build**: Passes successfully
- [x] **Dev server**: Running at http://localhost:3000
- [x] **Environment**: All keys configured (.env)

### Manual Testing Checklist
- [ ] Home page loads with cosmic background
- [ ] Question input works (character counter)
- [ ] "Cast the Dice" button triggers roll
- [ ] Dice animation shows (2.5s)
- [ ] Result displays with Planet/Sign/House
- [ ] Keywords display correctly
- [ ] Interpretation guide expands/collapses
- [ ] "Ask Again" resets to input
- [ ] Navigation works (Collection, Community placeholders)

### API Testing (requires database migration)
```bash
# Test auth endpoint
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"token": "eyJ..."}'

# Test create reading
curl -X POST http://localhost:3000/api/readings \
  -H "Authorization: Bearer eyJ..." \
  -H "Content-Type: application/json" \
  -d '{"question": "Test?", "planet": "Mars", "sign": "Aries", "house": 1}'
```

---

## Phase 1 - Foundation (COMPLETE)
- [x] Project scaffold (Next.js 16, TypeScript, Tailwind v4)
- [x] CLAUDE.md + IMPLEMENTATION_PLAN.md
- [x] Farcaster SDK + Wagmi dependencies
- [x] Providers, wagmi config, Farcaster auth helpers
- [x] Cosmic UI shell (background, header, nav)
- [x] Home screen with question input

## Phase 2 - Core Loop (COMPLETE)
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
- [x] Fixed lint warnings

## Phase 3 - AI Integration (READY)
Environment configured:
- [x] DATABASE_URL set
- [x] ANTHROPIC_API_KEY set
- [x] NEYNAR_API_KEY set

Next steps:
- [ ] Run database migration (0001_initial.sql)
- [ ] Install AI SDK: `pnpm add ai @ai-sdk/anthropic`
- [ ] Create lib/ai/prompts.ts
- [ ] Create lib/ai/generate.ts
- [ ] Create /api/ai/reading route
- [ ] Wire up "Get AI Reading" button with payment

---

## Environment Setup (COMPLETE)

```env
NEYNAR_API_KEY=✓ configured
DATABASE_URL=✓ configured (Neon Postgres)
ANTHROPIC_API_KEY=✓ configured
```

### Database Migration Required
Run this SQL on your Neon console before testing API routes:
```sql
-- See lib/db/migrations/0001_initial.sql
```

---

## Session Log

### 2026-01-12
- Ran lint: fixed 4 warnings (unused vars)
- Ran build: passes successfully
- Started dev server: http://localhost:3000
- Verified environment variables configured
- Ready for manual testing

### 2026-01-11
- **Phase 1:** Foundation complete
- **Phase 2:** Core Loop complete

---

## Files Structure

```
app/
├── page.tsx                    # Home (question → roll → result)
├── layout.tsx                  # Root layout with providers
├── providers.tsx               # Wagmi + QueryClient
├── collection/page.tsx         # Placeholder
├── community/page.tsx          # Placeholder
└── api/
    ├── auth/route.ts           # POST - verify JWT
    ├── readings/route.ts       # GET/POST readings
    └── readings/[id]/route.ts  # GET/PATCH single reading

components/
├── layout/
│   ├── cosmic-background.tsx   # Animated star field
│   ├── header.tsx              # App header
│   └── nav.tsx                 # Bottom navigation
├── dice/
│   ├── dice-animation.tsx      # Rolling animation
│   └── dice-result.tsx         # Result with keywords
└── reading/
    └── interpretation-guide.tsx

lib/
├── astrodice/                  # Types, constants, roll logic
├── db/                         # Schema, client, queries
├── farcaster/                  # SDK, auth helpers
└── wagmi/                      # Config
```

---

## Known Issues / Warnings

1. **Next.js workspace warning**: Multiple lockfiles detected
   - Non-blocking, can silence with turbopack.root config

2. **Peer dependency warnings**: @wagmi/core and typescript versions
   - Non-blocking, packages work correctly

---

## Quick Commands

```bash
pnpm dev      # Start dev server (http://localhost:3000)
pnpm build    # Production build
pnpm lint     # ESLint check
```

---

## Notes
- Dev server running in background
- All environment variables configured
- Database migration needed before API testing
- Neynar MCP available for Farcaster queries
