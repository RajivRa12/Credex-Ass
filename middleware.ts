import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Passthrough middleware for Vercel compatibility
  // Authentication is optional for MVP; full Supabase integration deferred
  return NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};