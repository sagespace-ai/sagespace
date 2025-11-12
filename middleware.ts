import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const isAccessGateEnabled = process.env.ENABLE_ACCESS_GATE === "true"
  const hasAccess = request.cookies.get("site-access")?.value === "granted"
  const isAccessGatePath = request.nextUrl.pathname.startsWith("/access-gate")
  const isApiPath = request.nextUrl.pathname.startsWith("/api")

  // If access gate is enabled and user doesn't have access, redirect to gate
  if (isAccessGateEnabled && !hasAccess && !isAccessGatePath && !isApiPath) {
    const url = new URL("/access-gate", request.url)
    url.searchParams.set("redirect", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  try {
    const { createServerClient } = await import("@supabase/ssr")

    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
          },
        },
      },
    )

    // Refresh session if expired
    await supabase.auth.getUser()

    return supabaseResponse
  } catch (error) {
    console.log("[v0] Middleware: Supabase not available, proceeding without auth:", error)
    return NextResponse.next({ request })
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
