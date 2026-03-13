import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
});

export function validateEnv() {
  return envSchema.parse(process.env);
}
