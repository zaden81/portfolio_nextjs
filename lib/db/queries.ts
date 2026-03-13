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
