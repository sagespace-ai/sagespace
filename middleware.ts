import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Password protection check
  const isAccessGateEnabled = process.env.ENABLE_ACCESS_GATE === "true"
  const isAccessGatePage = request.nextUrl.pathname === "/access-gate"
  const hasAccessCookie = request.cookies.has("site_access_granted")

  if (isAccessGateEnabled && !hasAccessCookie && !isAccessGatePage) {
    return NextResponse.redirect(new URL("/access-gate", request.url))
  }

  // Supabase auth

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
