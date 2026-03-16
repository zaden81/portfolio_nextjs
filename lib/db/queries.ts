import { getClient } from "./client";
import { ensureSchema } from "./schema";
import type { ContactInput } from "@/lib/validations";

export async function insertMessage(data: ContactInput) {
  await ensureSchema();
  const sql = getClient();
  await sql`
    INSERT INTO messages (name, email, message)
    VALUES (${data.name}, ${data.email}, ${data.message})
  `;
}

export async function getMessages() {
  await ensureSchema();
  const sql = getClient();
  return sql`SELECT id, name, email, message, created_at FROM messages ORDER BY created_at DESC`;
}
