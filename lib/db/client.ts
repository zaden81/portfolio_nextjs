import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import { validateEnv } from "@/lib/validations";

let sql: NeonQueryFunction<false, false> | null = null;

export function getClient() {
  if (!sql) {
    const env = validateEnv();
    sql = neon(env.DATABASE_URL);
  }
  return sql;
}
