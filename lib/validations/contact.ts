import { z } from "zod";

const CONTROL_CHARS = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/;

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less")
    .refine((v) => !CONTROL_CHARS.test(v), "Name contains invalid characters"),
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
    .max(2000, "Message must be 2000 characters or less")
    .refine((v) => !CONTROL_CHARS.test(v), "Message contains invalid characters"),
});

export type ContactInput = z.infer<typeof contactSchema>;
