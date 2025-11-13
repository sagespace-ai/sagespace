"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Sparkles, TrendingUp, BookmarkCheck, Globe2, Grid3x3 } from "lucide-react"
import { useJourney } from "@/lib/hooks/use-journey"
import { cn } from "@/lib/utils"

const ROUTES = [
  { path: "/", label: "Portal", icon: Sparkles },
  { path: "/council", label: "Council", icon: Users },
  { path: "/memory", label: "Memory Lane", icon: BookmarkCheck },
  { path: "/observatory", label: "Observatory", icon: TrendingUp },
  { path: "/multiverse", label: "Multiverse", icon: Globe2 },
  { path: "/marketplace", label: "Marketplace", icon: Grid3x3 },
]

function Users(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

export function CosmicDock() {
  const pathname = usePathname()
  const { context, nextRoute } = useJourney()

  // Mock user stats - will be replaced with real data
  const userStats = { xp: 2840, initials: "SU" }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-purple-500/20 bg-black/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo and Navigation Links */}
        <div className="flex items-center gap-1">
          <Link href="/" className="mr-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-cyan-400" />
            <span className="font-bold text-white">SageSpace</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 md:flex">
            {ROUTES.map((route) => {
              const Icon = route.icon
              const isActive = pathname === route.path
              return (
                <Link key={route.path} href={route.path}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "gap-2 text-slate-300 hover:bg-purple-500/10 hover:text-cyan-400",
                      isActive && "bg-purple-500/20 text-cyan-400",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden lg:inline">{route.label}</span>
                  </Button>
                </Link>
              )
            })}
          </div>

          {/* Mobile Menu Icon */}
          <Button variant="ghost" size="sm" className="md:hidden">
            <Grid3x3 className="h-5 w-5" />
          </Button>
        </div>

        {/* Right Side: Continue Journey, XP, Avatar */}
        <div className="flex items-center gap-3">
          <Link href={nextRoute}>
            <Button
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:from-purple-700 hover:to-cyan-700"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Continue Journey
            </Button>
          </Link>

          <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300">
            {userStats.xp} XP
          </Badge>

          <Avatar className="h-8 w-8 border-2 border-purple-500">
            <AvatarFallback className="bg-purple-900 text-cyan-300">{userStats.initials}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </nav>
  )
}
