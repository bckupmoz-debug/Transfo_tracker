import { handlers } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export const { GET, POST } = handlers;

export async function HEAD(request: NextRequest) {
  return handlers.GET(request);
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      Allow: "GET, POST, HEAD, OPTIONS",
    },
  });
}

export async function GET(request: NextRequest) {
  try {
    return await handlers.GET(request);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Authentication is not configured correctly.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}