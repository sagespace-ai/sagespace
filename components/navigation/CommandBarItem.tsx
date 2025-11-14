"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface CommandBarItemProps {
  path: string
  label: string
  icon: LucideIcon
  isActive: boolean
  indicator?: {
    type: "pulse" | "dot" | "count"
    value?: number
  }
}

export function CommandBarItem({ path, label, icon: Icon, isActive, indicator }: CommandBarItemProps) {
  return (
    <Link href={path}>
      <motion.div
        whileHover={{ y: -1 }}
        whileTap={{ y: 0 }}
        className="relative"
      >
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "gap-2 text-slate-300 hover:bg-purple-500/10 hover:text-cyan-400 relative",
            isActive && "bg-purple-500/20 text-cyan-400 shadow-lg shadow-cyan-500/20",
          )}
        >
          <Icon className="h-4 w-4" />
          <span className="hidden lg:inline">{label}</span>
          
          {/* Indicators */}
          {indicator?.type === "pulse" && (
            <span className="absolute top-1 right-1 w-2 h-2">
              <span className="absolute inset-0 rounded-full bg-purple-500 animate-ping opacity-75" />
              <span className="absolute inset-0 rounded-full bg-purple-500" />
            </span>
          )}
          
          {indicator?.type === "dot" && (
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-cyan-400" />
          )}
          
          {indicator?.type === "count" && indicator.value && indicator.value > 0 && (
            <Badge
              variant="secondary"
              className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px] bg-cyan-500 text-black border-0"
            >
              {indicator.value > 99 ? "99+" : indicator.value}
            </Badge>
          )}
        </Button>
        
        {/* Glow effect on active */}
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-md bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-md -z-10"
            animate={{
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </motion.div>
    </Link>
  )
}
