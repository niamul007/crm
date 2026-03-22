/**
 * DB/INDEX.MJS — DATABASE CONNECTION POOL
 * -----------------------------------------
 * Creates and exports a single PostgreSQL connection pool.
 * This pool is shared across all service files.
 * 
 * WHY A POOL?
 * Instead of opening a new database connection for every request (slow),
 * the pool keeps connections open and ready to use.
 * Think of it as a reception desk with multiple phone lines —
 * always open, just grab one when needed.
 * 
 * CONNECTION STRING
 * Comes from process.env.DATABASE_URL — provided by Neon
 * 
 * SSL
 * rejectUnauthorized: false — required for Neon cloud database
 */

import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, 
    // Required for Neon — allows SSL without verified certificate
  },
});

// Fires once when first connection is made
pool.on('connect', () => {
  console.log('Connected to the database. you are ready to go!');
});

// Single pool exported and shared across all service files
export default pool;