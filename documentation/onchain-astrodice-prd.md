# Onchain Astrodice - Product Requirements Document

**Version:** 1.0  
**Last Updated:** January 4, 2026  
**Author:** Justin + Claude  
**Status:** Ready for Development

---

## Executive Summary

**Product:** Onchain Astrodice  
**Platform:** Farcaster Miniapp  
**Chain:** Base  
**Core CTA:** Get AI Reading ($2)

**One-liner:** A divination miniapp that generates astrological readings using the classic astrodice system (Planet + Sign + House), with AI-powered interpretation and NFT collectibility.

---

## Problem Statement

Astrology apps have proven product-market fit (Co-Star, The Pattern, Sanctuary), but none combine:

- Onchain collectibility (mint your readings as NFTs)
- AI-powered personalized interpretation
- Native crypto distribution via Farcaster
- The interactive "casting" ritual of physical astrodice

Onchain Astrodice fills this gap for crypto-native users who want meaningful, collectible divination experiences.

---

## Target User

**Primary:** Crypto-native individuals on Farcaster interested in astrology, divination, and collectible digital experiences.

**Characteristics:**

- Active on Farcaster (Warpcast, Base App)
- Wallet-connected, comfortable with onchain transactions
- Interest in astrology, tarot, or esoteric practices
- Values unique digital collectibles

---

## Core Mechanics: The Astrodice System

Astrodice consist of three dice:

- **Planet die (12 options):** Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto, North Node, South Node
- **Sign die (12 options):** Aries through Pisces
- **House die (12 options):** Houses 1-12

This creates **1,728 unique combinations** (12 × 12 × 12).

**Interpretation framework:**

- **Planet** = What is happening (the energy/action)
- **Sign** = How it manifests (the style/approach)
- **House** = Where in your life (the domain/area)

---

## User Flow

```
[LOAD]
├── Quick Auth → get FID (Farcaster ID)
├── Fetch recent readings (<24h from KV store)
├── sdk.actions.ready() → hide splash
└── Wallet auto-connected via Wagmi connector

[HOME SCREEN]
├── Cosmic star background
├── "What question do you bring to the stars?"
├── Text input for question
├── [Cast the Dice] button
├── [Your Readings] → collection view
└── [Community Feed] → recent readings from follows

[CASTING ANIMATION]
├── 3 dice tumbling animation (2-3 seconds)
└── Builds anticipation/ritual feeling

[RESULT SCREEN]
├── Planet · Sign · House display with symbols
├── Keywords for each element
├── [See Interpretation Guide] → expand reference table
├── [Get AI Reading · $2] ← PRIMARY CTA
├── [Mint Reading] → mint flow
└── [Ask Again] → new question

[AI READING] (after $2 payment)
├── 200-250 word synthesized interpretation
├── Based on interpretation corpus
├── Contextual to user's question
├── [Go Deeper · $1] → extended reflection
├── [Mint with Interpretation]
└── [Share to Farcaster]

[EXTENDED READING] (after $1 add-on)
├── Additional 150-200 words
├── "Areas for reflection" section
├── Specific questions to sit with
└── [Mint Complete Reading]

[MINT FLOW]
├── Preview NFT artwork (Planet palette + Sign pattern + House glyph)
├── Metadata includes: question, result, interpretation (if purchased), timestamp, FID
├── Confirm transaction on Base
├── Success state
└── [View on Zora] | [Share] | [New Question]

[SHARE FLOW]
├── Compose cast with:
│   ├── Text: "I asked the stars: '[question]' → Mars in Pisces, 7th House"
│   └── Image card: NFT preview with link back to miniapp
└── Opens in Farcaster composer via sdk.actions.composeCast()

[COLLECTION VIEW]
├── Section: Minted Readings (permanent, queried from chain)
├── Section: Recent Readings (unminted, <24h, from KV store)
└── Tap any reading to expand → full details + re-mint option

[COMMUNITY FEED]
├── Recent readings from users you follow (via Neynar social graph)
├── Shows: username, question snippet, result
├── Tap to view details (if publicly shared)
└── Creates social proof + discovery
```

---

## Pricing Model

| Tier                 | Price          | Includes                                                  |
| -------------------- | -------------- | --------------------------------------------------------- |
| **Free Roll**        | $0             | Dice roll + result + keywords + self-interpretation guide |
| **AI Reading**       | $2 (ETH/USDC)  | 200-250 word synthesized interpretation                   |
| **Extended Reading** | +$1 (ETH/USDC) | Additional 150-200 words with reflection prompts          |
| **Mint**             | Gas only       | NFT on Base (~$0.01-0.05)                                 |

**Payment flow:** ETH or USDC on Base via Wagmi/Farcaster wallet

---

## Authentication & Wallet Strategy

### Authentication (Farcaster Quick Auth)

```typescript
// On app load
const { token } = await sdk.quickAuth.getToken();
// JWT contains FID - use to tie readings to user identity

// For authenticated API calls
await sdk.quickAuth.fetch(`${API}/readings`);

// Signal app ready
await sdk.actions.ready();
```

- Seamless authentication via Farcaster - no login forms
- JWT contains user's FID for identity
- Use `sdk.quickAuth.fetch()` for all authenticated backend calls

### Wallet (Auto-connected via Farcaster)

```typescript
import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector";

// Wallet auto-connects - no picker needed
const { isConnected, address } = useAccount();

// Transactions via Wagmi hooks
const { sendTransaction } = useSendTransaction();
```

- Wallet automatically available via Farcaster client
- No wallet selection UI needed
- Use Wagmi hooks for all transactions

---

## Data Architecture

### Ephemeral Readings (Vercel KV)

```
Key: readings:{fid}:{timestamp}
Value: {
  question: string,
  result: {
    planet: string,
    sign: string,
    house: number
  },
  aiReading?: string,
  extendedReading?: string,
  createdAt: number,
  paid: boolean
}
TTL: 24 hours
Max per user: 5 (rolling, oldest drops when exceeded)
```

**Rationale:**

- Zero infrastructure for casual rolls
- 24-hour buffer gives users time to decide to mint
- Creates gentle urgency without being aggressive
- Matches divination psychology (readings are moments)

### Permanent Readings (Onchain)

- Minted as NFTs on Base via Zora Protocol
- Token ID maps to metadata URI (IPFS)
- Query via Zora API or direct contract reads
- Includes full interpretation if purchased

---

## NFT Specification

### Visual Design System

**Approach:** Constrained symbolic system (not AI-generated art)

Each NFT is composed of deterministic visual elements based on the roll:

| Element              | Driven By            | Description                                                            |
| -------------------- | -------------------- | ---------------------------------------------------------------------- |
| Background gradient  | Planet               | 12 distinct color palettes (Sun=gold, Moon=silver, Mars=crimson, etc.) |
| Border pattern       | Sign                 | 12 geometric patterns (Aries=angular, Pisces=wavy, etc.)               |
| Central glyph        | House                | 12 symbolic representations for each life domain                       |
| Star field density   | Composite hash       | Variable sparse → dense                                                |
| Typography treatment | AI reading purchased | Standard vs. Ornate                                                    |

**Visual layout:**

```
┌─────────────────────────────────────────┐
│                                         │
│    ☉ Mars  ·  ♓ Pisces  ·  7th House   │
│                                         │
│         [Central House Glyph]           │
│                                         │
│    "What will come of this love?"       │
│                                         │
│    ─────────────────────────────────    │
│    Jan 4, 2026 · @username              │
│                                         │
└─────────────────────────────────────────┘
```

**Why this approach:**

- Visually coherent collection aesthetic
- Meaningful variation (Mars readings _look_ different from Venus)
- No uncanny valley (programmatic, not AI-generated)
- Collectible logic ("I have 3 Mars readings")
- Technically simple (SVG composition)

### Metadata Structure

```json
{
  "name": "Astrodice Reading #1234",
  "description": "Mars in Pisces, 7th House",
  "image": "ipfs://[generated-image-hash]",
  "external_url": "https://astrodice.xyz/reading/1234",
  "attributes": [
    { "trait_type": "Planet", "value": "Mars" },
    { "trait_type": "Sign", "value": "Pisces" },
    { "trait_type": "House", "value": "7" },
    { "trait_type": "Question", "value": "What will come of this love?" },
    { "trait_type": "Has AI Reading", "value": "Yes" },
    { "trait_type": "Has Extended Reading", "value": "No" },
    { "trait_type": "Timestamp", "value": "1704384000" }
  ],
  "interpretation": "Your reading synthesized text here..."
}
```

---

## AI Interpretation System

### Base Reading ($2) - 200-250 words

**Prompt structure:**

```
You are an expert astrologer interpreting an astrodice reading.

The user asked: "[QUESTION]"

They rolled:
- Planet: [PLANET] - [planet meaning from corpus]
- Sign: [SIGN] - [sign meaning from corpus]
- House: [HOUSE] - [house meaning from corpus]

Synthesize these three elements into a cohesive 200-250 word interpretation that:
1. Acknowledges their specific question
2. Explains what energy is available (Planet)
3. Describes how it will manifest (Sign)
4. Identifies the life area affected (House)
5. Provides actionable insight

Tone: Mystical but grounded, warm but not fluffy.
Avoid: Generic horoscope language, doom/gloom, definitive predictions.
```

### Extended Reading (+$1) - Additional 150-200 words

**Adds:**

- "Areas for Reflection" section
- 3-4 specific questions for the user to sit with
- Deeper exploration of the planetary/sign interaction
- Timing considerations if relevant

---

## Tech Stack

| Layer             | Technology                                 | Purpose                              |
| ----------------- | ------------------------------------------ | ------------------------------------ |
| **Framework**     | Next.js 14+ (App Router)                   | Core application                     |
| **Farcaster SDK** | @farcaster/miniapp-sdk                     | Miniapp integration                  |
| **Wallet**        | @farcaster/miniapp-wagmi-connector + Wagmi | Wallet connection & transactions     |
| **AI**            | Vercel AI SDK (Claude Sonnet or GPT-4)     | Reading interpretation               |
| **Chain**         | Base                                       | Low-cost L2 with Farcaster alignment |
| **NFT Protocol**  | Zora Creator Toolkit                       | Minting infrastructure               |
| **KV Storage**    | Vercel KV (or Upstash)                     | Ephemeral reading storage            |
| **Social Data**   | Neynar API                                 | Farcaster social graph queries       |
| **Styling**       | Tailwind CSS                               | UI styling                           |
| **Deployment**    | Vercel                                     | Hosting & edge functions             |

---

## Miniapp Best Practices Integration

Based on successful Farcaster miniapp patterns (Protardio, QRCoin):

### 1. Clear Core CTA

**Primary CTA:** "Get AI Reading" ($2)

- Revenue driver
- Differentiated value proposition
- Everything flows toward this moment

**Secondary CTA:** "Mint Reading"

- Permanence and collectibility
- Available to all users (free users mint raw roll, paid users mint with interpretation)

### 2. Complementary Features

| Feature                 | Purpose                     | CTA Support                                      |
| ----------------------- | --------------------------- | ------------------------------------------------ |
| **Reading Collection**  | View minted readings        | "Look at your collection... add another?"        |
| **Community Feed**      | See follows' readings       | Social proof, FOMO ("@alice just got a reading") |
| **Trait Explorer** (v2) | Browse by Planet/Sign/House | Discovery, collection completionism              |

### 3. Recurring Engagement Hooks

| Hook                         | Implementation                                                                 |
| ---------------------------- | ------------------------------------------------------------------------------ |
| **Daily Prompt**             | Push notification: "The stars have shifted. What question do you bring today?" |
| **Social Triggers**          | "3 people you follow got readings today"                                       |
| **Celestial Events** (v2)    | "Mercury retrograde - ask about communication"                                 |
| **Reading Anniversary** (v2) | "One year ago you asked about your career"                                     |

---

## MVP Scope

### In Scope (v1.0)

- [ ] Question input → dice roll → result display
- [ ] Self-interpretation reference guide (from corpus)
- [ ] AI reading generation ($2)
- [ ] Extended reading add-on ($1)
- [ ] Mint reading as NFT on Base via Zora
- [ ] Reading collection view (minted + recent unminted)
- [ ] Share to Farcaster (text + image card)
- [ ] Community feed (follows' readings via Neynar)
- [ ] Push notification infrastructure
- [ ] Basic analytics (rolls, conversions, mints)

### Out of Scope (v2 Candidates)

- [ ] Trait explorer ("all Mars in Pisces readings")
- [ ] Celestial event-triggered prompts
- [ ] Reading anniversary reminders
- [ ] Webapp version (broader distribution)
- [ ] Human astrologer upsell
- [ ] Streak/gamification mechanics
- [ ] Reading comparisons ("you and @friend both got Mars")

---

## Success Metrics

| Metric                      | Target (30 days post-launch)  |
| --------------------------- | ----------------------------- |
| Total rolls                 | 5,000+                        |
| AI reading conversion rate  | 15%+ of rolls                 |
| Extended reading conversion | 30%+ of AI reading purchasers |
| Mint rate                   | 10%+ of rolls                 |
| 7-day user retention        | 25%+                          |
| Revenue                     | $500+                         |
| Farcaster shares            | 500+ casts                    |

---

## Development Phases

### Phase 1: Foundation (Week 1)

- [ ] Next.js scaffold with Farcaster SDK
- [ ] Wagmi configuration for Base
- [ ] Quick Auth implementation
- [ ] Basic UI shell with cosmic theme

### Phase 2: Core Loop (Week 2)

- [ ] Dice rolling logic (client-side RNG)
- [ ] Result display with keywords
- [ ] Self-interpretation guide component
- [ ] Vercel KV integration for reading storage

### Phase 3: AI Integration (Week 3)

- [ ] Vercel AI SDK setup
- [ ] Interpretation prompt engineering
- [ ] Base reading generation
- [ ] Extended reading generation
- [ ] Payment flow (ETH/USDC)

### Phase 4: NFT & Minting (Week 4)

- [ ] Zora contract deployment on Base
- [ ] NFT visual generation system (SVG composition)
- [ ] IPFS metadata upload
- [ ] Mint transaction flow

### Phase 5: Social & Polish (Week 5)

- [ ] Neynar integration for social graph
- [ ] Community feed implementation
- [ ] Share flow with image cards
- [ ] Collection view
- [ ] Notification setup

### Phase 6: Launch Prep (Week 6)

- [ ] Farcaster manifest (farcaster.json)
- [ ] Miniapp submission
- [ ] Analytics implementation
- [ ] Bug fixes & performance optimization
- [ ] Launch marketing assets

---

## Open Items & Dependencies

### Design Assets Needed

- [ ] 12 planet color palettes
- [ ] 12 sign geometric patterns
- [ ] 12 house symbolic glyphs
- [ ] App icon and splash screen
- [ ] Share card template

### External Dependencies

- [ ] Neynar API key
- [ ] Zora contract deployment
- [ ] IPFS/Arweave for metadata storage
- [ ] Vercel KV provisioning

### Decisions to Finalize

- [ ] Exact AI model (Claude Sonnet vs GPT-4)
- [ ] NFT collection name and branding
- [ ] Notification copy and cadence
- [ ] Launch date target

---

## Appendix: Interpretation Corpus Reference

The AI reading system uses a comprehensive interpretation guide covering:

**Planets (12):** Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto, North Node, South Node

**Signs (12):** Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, Pisces

**Houses (12):**

1. Self/appearance
2. Resources/money
3. Communication
4. Home/family
5. Creativity/children
6. Work/health
7. Relationships
8. Transformation/shared resources
9. Philosophy/travel
10. Career/reputation
11. Friends/community
12. Unconscious/seclusion

Full interpretation text available in separate corpus document.

---

## Document History

| Version | Date        | Changes     |
| ------- | ----------- | ----------- |
| 1.0     | Jan 4, 2026 | Initial PRD |

---

_This PRD is a living document and will be updated as development progresses and requirements evolve._
