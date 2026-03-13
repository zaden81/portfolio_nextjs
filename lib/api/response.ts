import { NextResponse } from "next/server";

export function successResponse(message: string, status = 200) {
  return NextResponse.json({ success: message }, { status });
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}
