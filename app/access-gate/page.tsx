"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Lock } from "@/components/icons"

export default function AccessGate() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/access/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })

      if (response.ok) {
        // Redirect to the intended destination
        const params = new URLSearchParams(window.location.search)
        const redirect = params.get("redirect") || "/"
        router.push(redirect)
        router.refresh()
      } else {
        setError("Incorrect password")
      }
    } catch (err) {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-slate-950 to-violet-950/20 p-4">
      {/* Animated stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <Card className="w-full max-w-md bg-black/40 backdrop-blur-xl border-white/10 p-8 relative z-10">
        <div className="flex flex-col items-center gap-6">
          <div className="p-4 rounded-full bg-cyan-500/10 border border-cyan-500/20">
            <Lock className="w-8 h-8 text-cyan-400" />
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
              SageSpace
            </h1>
            <p className="text-sm text-gray-400 mt-2">Private Access Required</p>
            <p className="text-xs text-gray-500 mt-1">This site is currently under development</p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Enter access password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                autoFocus
              />
              {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </div>

            <Button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600"
            >
              {loading ? "Verifying..." : "Access SageSpace"}
            </Button>
          </form>

          <p className="text-xs text-gray-500 text-center">Building the future of AI governance 🚀</p>
        </div>
      </Card>
    </div>
  )
}
