import { getClient } from "./client";

let initialized = false;

export async function ensureSchema() {
  if (initialized) return;

  const sql = getClient();
  await sql`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(120) NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
  initialized = true;
}
