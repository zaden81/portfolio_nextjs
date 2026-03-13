import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address")
    .max(120, "Email must be 120 characters or less"),
  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(2000, "Message must be 2000 characters or less"),
});

export type ContactInput = z.infer<typeof contactSchema>;
