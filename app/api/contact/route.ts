import { contactSchema } from "@/lib/validations";
import { insertMessage } from "@/lib/db";
import { successResponse, errorResponse } from "@/lib/api";
import { checkRateLimit } from "@/lib/rate-limit";

const RATE_LIMIT = { windowMs: 60_000, maxRequests: 5 }; // 5 requests per minute per IP

const ALLOWED_ORIGINS = new Set(
  [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.NODE_ENV === "development" ? "http://localhost:3000" : null,
  ].filter(Boolean),
);

export async function POST(request: Request) {
  try {
    // CSRF: validate Origin header
    const origin = request.headers.get("origin");
    if (!origin || !ALLOWED_ORIGINS.has(origin)) {
      return errorResponse("Forbidden.", 403);
    }

    // Prefer x-real-ip (set by Vercel, not spoofable) over x-forwarded-for
    const ip =
      request.headers.get("x-real-ip") ||
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";

    const { allowed } = checkRateLimit(ip, RATE_LIMIT);
    if (!allowed) {
      return errorResponse("Too many requests. Please try again later.", 429);
    }

    // Validate Content-Type
    const contentType = request.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return errorResponse("Content-Type must be application/json.", 415);
    }

    // Parse JSON with separate error handling
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return errorResponse("Invalid JSON in request body.", 400);
    }

    const result = contactSchema.safeParse(body);
    if (!result.success) {
      const firstError = result.error.issues[0]?.message ?? "Invalid input.";
      return errorResponse(firstError);
    }

    await insertMessage(result.data);

    return successResponse("Thank you! Your message has been sent.");
  } catch (err) {
    console.error("[ERROR][Contact]", err);
    return errorResponse("Error saving message.", 500);
  }
}
