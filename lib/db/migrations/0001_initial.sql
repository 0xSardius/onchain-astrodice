-- Onchain Astrodice Database Schema
-- Run this migration on your Neon Postgres database

-- Users table (synced from Farcaster)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  fid INTEGER UNIQUE NOT NULL,
  username VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Readings table
CREATE TABLE IF NOT EXISTS readings (
  id SERIAL PRIMARY KEY,
  user_fid INTEGER REFERENCES users(fid) NOT NULL,
  question TEXT NOT NULL,
  planet VARCHAR(50) NOT NULL,
  sign VARCHAR(50) NOT NULL,
  house INTEGER NOT NULL,
  ai_reading TEXT,
  extended_reading TEXT,
  is_minted BOOLEAN DEFAULT FALSE NOT NULL,
  token_id INTEGER,
  tx_hash VARCHAR(66),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  expires_at TIMESTAMP -- NULL if minted, 24h from creation if not
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_readings_user ON readings(user_fid);
CREATE INDEX IF NOT EXISTS idx_readings_minted ON readings(is_minted);
CREATE INDEX IF NOT EXISTS idx_readings_expires ON readings(expires_at);

-- Comment on tables
COMMENT ON TABLE users IS 'Users synced from Farcaster via FID';
COMMENT ON TABLE readings IS 'Astrodice readings with optional AI interpretation and NFT minting';
