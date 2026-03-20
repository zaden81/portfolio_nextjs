import { contactSchema } from "@/lib/validations";
import { insertMessage } from "@/lib/db";
import { successResponse, errorResponse } from "@/lib/api";
import { checkRateLimit } from "@/lib/rate-limit";

const RATE_LIMIT = { windowMs: 60_000, maxRequests: 5 }; // 5 requests per minute per IP

export async function POST(request: Request) {
  try {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";
    const { allowed } = checkRateLimit(ip, RATE_LIMIT);

    if (!allowed) {
      return errorResponse("Too many requests. Please try again later.", 429);
    }

    const body = await request.json();
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
