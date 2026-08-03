import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const error = searchParams.get("error");
  const next = searchParams.get("next") ?? "/";

  if (error) {
    const errorUrl = new URL("/auth/auth-code-error", origin);
    errorUrl.searchParams.set("error", error);
    return NextResponse.redirect(errorUrl);
  }

  const fallbackPath = next.startsWith("/") ? next : "/";
  return NextResponse.redirect(new URL(fallbackPath, origin));
}