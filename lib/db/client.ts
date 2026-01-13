import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

function getConnectionString(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL environment variable is not set. " +
        "Please add it to your .env file."
    );
  }
  return url;
}

// Create database connection lazily via getter
// This ensures the connection is only created at runtime, not build time
export function getDb() {
  const sql = neon(getConnectionString());
  return drizzle(sql, { schema });
}

// For backwards compatibility - use getDb() in API routes
export const db = {
  get select() {
    return getDb().select.bind(getDb());
  },
  get insert() {
    return getDb().insert.bind(getDb());
  },
  get update() {
    return getDb().update.bind(getDb());
  },
  get delete() {
    return getDb().delete.bind(getDb());
  },
};
