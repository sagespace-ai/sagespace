import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const { password } = await request.json()

    // Check against environment variable
    const correctPassword = process.env.SITE_ACCESS_PASSWORD

    if (!correctPassword) {
      // If no password is set, allow access
      return NextResponse.json({ success: true })
    }

    if (password === correctPassword) {
      // Set a secure cookie that lasts 7 days
      const cookieStore = await cookies()
      cookieStore.set("site-access", "granted", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false }, { status: 401 })
  } catch (error) {
    console.error("[v0] Access verification error:", error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
