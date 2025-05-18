import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const publicPaths = ["/", "/auth/signin", "/checkin", "/feedback"]
  const isPublicPath = publicPaths.some((publicPath) => path === publicPath || path.startsWith("/api/"))

  // Get the session token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // If the path is public, allow access
  if (isPublicPath) {
    return NextResponse.next()
  }

  // If the path is admin and the user is not an admin, redirect to sign in
  if (path.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/signin?callbackUrl=/admin/dashboard", request.url))
    }

    if (!["admin", "dept_head"].includes(token.role as string)) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  // For all other paths, check if the user is authenticated
  if (!token) {
    return NextResponse.redirect(new URL("/auth/signin", request.url))
  }

  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api/auth/* (NextAuth.js authentication routes)
     * 2. /_next/* (Next.js internals)
     * 3. /static/* (static files)
     * 4. /favicon.ico, /robots.txt (common static files)
     */
    "/((?!api/auth|_next|static|favicon.ico|robots.txt).*)",
  ],
}
