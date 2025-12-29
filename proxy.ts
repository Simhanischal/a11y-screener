import { NextResponse, type NextRequest } from "next/server";
import { auth0 } from "./lib/auth0";

const protectedRoutes = ['/history'];

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const session = await auth0.getSession();
  const user = session?.user;
  if (protectedRoutes.includes(path) && !user) {
    return NextResponse.redirect(new URL(`/auth/login?returnTo=${path}`, request.nextUrl));
  }
  return await auth0.middleware(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};