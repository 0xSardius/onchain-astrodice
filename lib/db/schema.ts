import {
  pgTable,
  serial,
  integer,
  varchar,
  text,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

// Users table - synced from Farcaster
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  fid: integer("fid").unique().notNull(),
  username: varchar("username", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Readings table
export const readings = pgTable(
  "readings",
  {
    id: serial("id").primaryKey(),
    userFid: integer("user_fid")
      .references(() => users.fid)
      .notNull(),
    question: text("question").notNull(),
    planet: varchar("planet", { length: 50 }).notNull(),
    sign: varchar("sign", { length: 50 }).notNull(),
    house: integer("house").notNull(),
    aiReading: text("ai_reading"),
    extendedReading: text("extended_reading"),
    isMinted: boolean("is_minted").default(false).notNull(),
    tokenId: integer("token_id"),
    txHash: varchar("tx_hash", { length: 66 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    expiresAt: timestamp("expires_at"), // NULL if minted, 24h from creation if not
  },
  (table) => [
    index("idx_readings_user").on(table.userFid),
    index("idx_readings_minted").on(table.isMinted),
    index("idx_readings_expires").on(table.expiresAt),
  ]
);

// Type exports for use in application
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Reading = typeof readings.$inferSelect;
export type NewReading = typeof readings.$inferInsert;
