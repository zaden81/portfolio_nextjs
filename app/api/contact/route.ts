import { contactSchema } from "@/lib/validations";
import { insertMessage } from "@/lib/db";
import { successResponse, errorResponse } from "@/lib/api";

export async function POST(request: Request) {
  try {
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
