import { getMessages } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const messages = await getMessages();
    return NextResponse.json(messages);
  } catch (err) {
    console.error("[ERROR][Messages]", err);
    return NextResponse.json({ error: "Failed to fetch messages." }, { status: 500 });
  }
}
