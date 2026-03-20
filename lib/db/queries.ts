import { getClient } from "./client";
import type { ContactInput } from "@/lib/validations";

export async function insertMessage(data: ContactInput) {
  const sql = getClient();
  await sql`
    INSERT INTO messages (name, email, message)
    VALUES (${data.name}, ${data.email}, ${data.message})
  `;
}
