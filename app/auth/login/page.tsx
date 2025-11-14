"use client"

import type React from "react"
import { useEffect } from "react"
import { useState } from "react"
import { useRouter } from 'next/navigation'
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SimpleLogo } from "@/components/branding/SimpleLogo"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const router = useRouter()
  // const supabase = createClient()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get("reset") === "success") {
      setSuccessMessage("Password reset successful! You can now log in with your new password.")
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (!email || !password) {
        throw new Error("Please enter both email and password")
      }

      console.log("[v0] Attempting login for email:", email.trim())

      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) {
        console.error("[v0] Login error:", error)
        
        if (error.message.includes("Invalid login credentials")) {
          throw new Error(
            "Invalid email or password. If you don't have an account yet, please sign up first."
          )
        }
        if (error.message.includes("Email not confirmed")) {
          throw new Error(
            "Please check your email and confirm your account before logging in."
          )
        }
        throw error
      }

      if (!data.user) {
        throw new Error("Login failed. Please try again.")
      }

      console.log("[v0] Login successful for user:", data.user.id)
      
      // Successful login - redirect to demo
      router.push("/demo")
    } catch (err: any) {
      console.error("[v0] Login error:", err)
      setError(err.message || "Failed to log in. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-slate-900 to-black flex items-center justify-center p-4">
      {/* Animated stars */}
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            opacity: Math.random() * 0.7 + 0.3,
          }}
        />
      ))}

      <Card className="relative w-full max-w-md bg-slate-900/80 border-purple-500/20 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6">
            <SimpleLogo size="lg" />
          </div>
          <CardTitle className="text-2xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Welcome to SageSpace
          </CardTitle>
          <CardDescription className="text-slate-400">Log in to access your agent universe</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-cyan-400 hover:text-cyan-300"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            {successMessage && (
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-green-400 text-sm">{successMessage}</p>
              </div>
            )}
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
            </Button>
          </form>
          <div className="mt-4 text-center text-slate-400 text-sm">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-cyan-400 hover:text-cyan-300">
              Sign up
            </Link>
          </div>
          
          <div className="mt-4 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
            <p className="text-cyan-300 text-xs text-center">
              💡 New to SageSpace? Create an account by clicking "Sign up" above.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
