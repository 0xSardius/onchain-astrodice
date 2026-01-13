import type {
  Planet,
  Sign,
  House,
  PlanetInfo,
  SignInfo,
  HouseInfo,
} from "./types";

// ============================================
// PLANETS - What energy/action is happening
// ============================================

export const PLANETS: PlanetInfo[] = [
  {
    name: "Sun",
    symbol: "☉",
    keywords: ["Identity", "Vitality", "Purpose", "Self-expression"],
    meaning:
      "Core self, ego, life force, creativity, and conscious will. The Sun illuminates what needs attention and where you shine.",
  },
  {
    name: "Moon",
    symbol: "☽",
    keywords: ["Emotions", "Intuition", "Nurturing", "Subconscious"],
    meaning:
      "Emotional needs, instincts, habits, and inner security. The Moon reveals what comforts you and how you process feelings.",
  },
  {
    name: "Mercury",
    symbol: "☿",
    keywords: ["Communication", "Thinking", "Learning", "Exchange"],
    meaning:
      "Mind, communication style, logic, and information processing. Mercury governs how you think, speak, and connect ideas.",
  },
  {
    name: "Venus",
    symbol: "♀",
    keywords: ["Love", "Beauty", "Values", "Attraction"],
    meaning:
      "Love, pleasure, aesthetics, and what you value. Venus shows how you attract and what brings you joy and harmony.",
  },
  {
    name: "Mars",
    symbol: "♂",
    keywords: ["Action", "Drive", "Courage", "Desire"],
    meaning:
      "Will, assertion, physical energy, and how you pursue goals. Mars reveals your fighting spirit and raw motivation.",
  },
  {
    name: "Jupiter",
    symbol: "♃",
    keywords: ["Expansion", "Luck", "Wisdom", "Growth"],
    meaning:
      "Abundance, opportunity, faith, and higher learning. Jupiter expands whatever it touches and brings optimism.",
  },
  {
    name: "Saturn",
    symbol: "♄",
    keywords: ["Structure", "Discipline", "Limits", "Mastery"],
    meaning:
      "Boundaries, responsibility, time, and hard-won achievement. Saturn teaches through challenges and builds lasting foundations.",
  },
  {
    name: "Uranus",
    symbol: "♅",
    keywords: ["Change", "Innovation", "Freedom", "Awakening"],
    meaning:
      "Sudden change, rebellion, originality, and breakthrough. Uranus disrupts the status quo to liberate and revolutionize.",
  },
  {
    name: "Neptune",
    symbol: "♆",
    keywords: ["Dreams", "Spirituality", "Illusion", "Transcendence"],
    meaning:
      "Imagination, spirituality, dissolution of boundaries, and universal love. Neptune inspires but can also confuse.",
  },
  {
    name: "Pluto",
    symbol: "♇",
    keywords: ["Transformation", "Power", "Death/Rebirth", "Shadow"],
    meaning:
      "Deep transformation, hidden power, destruction and regeneration. Pluto reveals what must die so something new can emerge.",
  },
  {
    name: "North Node",
    symbol: "☊",
    keywords: ["Destiny", "Growth", "Future", "Soul Purpose"],
    meaning:
      "Your soul's growth direction, karmic path forward, and destined lessons. The North Node points to unfamiliar but necessary territory.",
  },
  {
    name: "South Node",
    symbol: "☋",
    keywords: ["Past", "Comfort Zone", "Gifts", "Release"],
    meaning:
      "Past life gifts, innate talents, and patterns to release. The South Node shows what's familiar but may hold you back.",
  },
];

// ============================================
// SIGNS - How the energy manifests
// ============================================

export const SIGNS: SignInfo[] = [
  {
    name: "Aries",
    symbol: "♈",
    element: "Fire",
    modality: "Cardinal",
    keywords: ["Bold", "Pioneering", "Direct", "Competitive"],
    meaning:
      "With courage and initiative. Act first, think later. Lead with passion and embrace new beginnings.",
  },
  {
    name: "Taurus",
    symbol: "♉",
    element: "Earth",
    modality: "Fixed",
    keywords: ["Steady", "Sensual", "Patient", "Resourceful"],
    meaning:
      "With patience and persistence. Build slowly, value quality. Ground yourself in physical pleasures and security.",
  },
  {
    name: "Gemini",
    symbol: "♊",
    element: "Air",
    modality: "Mutable",
    keywords: ["Curious", "Versatile", "Communicative", "Witty"],
    meaning:
      "With curiosity and adaptability. Gather information, make connections. Stay mentally agile and embrace variety.",
  },
  {
    name: "Cancer",
    symbol: "♋",
    element: "Water",
    modality: "Cardinal",
    keywords: ["Nurturing", "Protective", "Intuitive", "Emotional"],
    meaning:
      "With emotional sensitivity and care. Protect what matters, trust your feelings. Create safety and belonging.",
  },
  {
    name: "Leo",
    symbol: "♌",
    element: "Fire",
    modality: "Fixed",
    keywords: ["Creative", "Generous", "Proud", "Dramatic"],
    meaning:
      "With confidence and heart. Express yourself boldly, lead with warmth. Shine your light and inspire others.",
  },
  {
    name: "Virgo",
    symbol: "♍",
    element: "Earth",
    modality: "Mutable",
    keywords: ["Analytical", "Helpful", "Precise", "Humble"],
    meaning:
      "With discernment and service. Perfect the details, be useful. Improve systems and offer practical help.",
  },
  {
    name: "Libra",
    symbol: "♎",
    element: "Air",
    modality: "Cardinal",
    keywords: ["Diplomatic", "Harmonious", "Fair", "Partnering"],
    meaning:
      "With grace and balance. Seek fairness, value relationships. Create beauty and find the middle way.",
  },
  {
    name: "Scorpio",
    symbol: "♏",
    element: "Water",
    modality: "Fixed",
    keywords: ["Intense", "Transformative", "Probing", "Loyal"],
    meaning:
      "With depth and intensity. Go beneath the surface, embrace transformation. Trust through vulnerability.",
  },
  {
    name: "Sagittarius",
    symbol: "♐",
    element: "Fire",
    modality: "Mutable",
    keywords: ["Adventurous", "Optimistic", "Philosophical", "Free"],
    meaning:
      "With enthusiasm and vision. Explore new horizons, seek meaning. Expand your worldview and aim high.",
  },
  {
    name: "Capricorn",
    symbol: "♑",
    element: "Earth",
    modality: "Cardinal",
    keywords: ["Ambitious", "Disciplined", "Strategic", "Responsible"],
    meaning:
      "With determination and strategy. Build for the long term, earn respect. Master your craft through dedication.",
  },
  {
    name: "Aquarius",
    symbol: "♒",
    element: "Air",
    modality: "Fixed",
    keywords: ["Innovative", "Humanitarian", "Independent", "Visionary"],
    meaning:
      "With originality and idealism. Think differently, serve the collective. Champion progress and individuality.",
  },
  {
    name: "Pisces",
    symbol: "♓",
    element: "Water",
    modality: "Mutable",
    keywords: ["Compassionate", "Imaginative", "Spiritual", "Flowing"],
    meaning:
      "With empathy and imagination. Dissolve boundaries, trust the unseen. Surrender to the flow and dream big.",
  },
];

// ============================================
// HOUSES - Where in life (domain/area)
// ============================================

export const HOUSES: HouseInfo[] = [
  {
    number: 1,
    name: "Self & Identity",
    keywords: ["Appearance", "First impressions", "Physical body", "Persona"],
    meaning:
      "Your self-image, physical appearance, and how you present to the world. The mask you wear and your approach to new beginnings.",
  },
  {
    number: 2,
    name: "Resources & Values",
    keywords: ["Money", "Possessions", "Self-worth", "Material security"],
    meaning:
      "Your relationship with money, possessions, and material security. What you value and how you build tangible resources.",
  },
  {
    number: 3,
    name: "Communication & Mind",
    keywords: ["Siblings", "Neighbors", "Short trips", "Daily communication"],
    meaning:
      "Daily communication, learning, siblings, and immediate environment. How you process and share information.",
  },
  {
    number: 4,
    name: "Home & Family",
    keywords: ["Roots", "Parents", "Ancestry", "Private life"],
    meaning:
      "Your home, family, roots, and inner foundation. Where you come from and what makes you feel secure.",
  },
  {
    number: 5,
    name: "Creativity & Pleasure",
    keywords: ["Romance", "Children", "Play", "Self-expression"],
    meaning:
      "Creative expression, romance, children, and fun. Where you play, take risks, and express your unique spark.",
  },
  {
    number: 6,
    name: "Work & Health",
    keywords: ["Daily routines", "Service", "Wellness", "Duties"],
    meaning:
      "Daily work, health habits, service to others, and routines. How you maintain your body and be useful.",
  },
  {
    number: 7,
    name: "Relationships & Partners",
    keywords: ["Marriage", "Business partners", "Contracts", "Open enemies"],
    meaning:
      "One-on-one relationships, marriage, partnerships, and how you relate to significant others.",
  },
  {
    number: 8,
    name: "Transformation & Shared Resources",
    keywords: ["Intimacy", "Death", "Inheritance", "Other's money"],
    meaning:
      "Deep transformation, shared resources, intimacy, and psychological depths. What you merge with others.",
  },
  {
    number: 9,
    name: "Philosophy & Expansion",
    keywords: ["Higher education", "Travel", "Beliefs", "Publishing"],
    meaning:
      "Higher learning, long-distance travel, philosophy, and expansion of consciousness. Your search for meaning.",
  },
  {
    number: 10,
    name: "Career & Public Image",
    keywords: ["Reputation", "Achievement", "Authority", "Legacy"],
    meaning:
      "Career, public reputation, achievements, and your place in society. How the world sees your contributions.",
  },
  {
    number: 11,
    name: "Community & Dreams",
    keywords: ["Friends", "Groups", "Hopes", "Social causes"],
    meaning:
      "Friendships, groups, hopes for the future, and social networks. Your tribe and collective aspirations.",
  },
  {
    number: 12,
    name: "Unconscious & Spirituality",
    keywords: ["Hidden matters", "Solitude", "Karma", "Self-undoing"],
    meaning:
      "The unconscious, hidden strengths and weaknesses, spirituality, and endings. What lies beneath the surface.",
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getPlanetInfo(planet: Planet): PlanetInfo {
  return PLANETS.find((p) => p.name === planet)!;
}

export function getSignInfo(sign: Sign): SignInfo {
  return SIGNS.find((s) => s.name === sign)!;
}

export function getHouseInfo(house: House): HouseInfo {
  return HOUSES.find((h) => h.number === house)!;
}

// Arrays for random selection
export const PLANET_NAMES: Planet[] = PLANETS.map((p) => p.name);
export const SIGN_NAMES: Sign[] = SIGNS.map((s) => s.name);
export const HOUSE_NUMBERS: House[] = HOUSES.map((h) => h.number);
