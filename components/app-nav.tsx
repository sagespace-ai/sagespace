"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/playground", label: "Playground", icon: "💬" },
  { href: "/council", label: "Circle", icon: "🤝" },
  { href: "/persona-editor", label: "Studio", icon: "⚡" },
  { href: "/memory", label: "Memory", icon: "📖" },
  { href: "/marketplace", label: "Marketplace", icon: "🏪" },
]

export function AppNav() {
  const pathname = usePathname()

  if (pathname === "/" || pathname.startsWith("/auth")) {
    return null
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-t border-white/10 lg:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "flex flex-col items-center gap-1 h-auto py-2 px-3",
                pathname === item.href ? "text-cyan-400 bg-cyan-400/10" : "text-slate-400 hover:text-white",
              )}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs">{item.label}</span>
            </Button>
          </Link>
        ))}
      </div>
    </nav>
  )
}
