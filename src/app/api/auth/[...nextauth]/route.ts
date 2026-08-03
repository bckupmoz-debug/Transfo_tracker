import { handlers } from "@/auth";
import { NextRequest } from "next/server";

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