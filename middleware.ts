import { NextResponse, type NextRequest } from "next/server";

// Firebase Admin SDK cannot run in Edge runtime, so middleware
// only checks cookie existence. Full verification happens in server components
// via lib/auth.ts (getCurrentUser / requireAuth).
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow these paths
  if (
    pathname.startsWith("/api/") ||
    pathname === "/login" ||
    pathname === "/unauthorized"
  ) {
    return NextResponse.next();
  }

  const session = request.cookies.get("__session")?.value;
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
