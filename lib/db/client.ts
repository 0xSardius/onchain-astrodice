import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Create Neon SQL client
const sql = neon(process.env.DATABASE_URL!);

// Create Drizzle ORM instance
export const db = drizzle(sql, { schema });

// Export raw SQL client for direct queries if needed
export { sql };
