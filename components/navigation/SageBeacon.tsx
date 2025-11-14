"use client"

import { motion } from "framer-motion"
import type { SystemStatus } from "@/lib/types/navigation"

const STATUS_COLORS = {
  ok: "bg-emerald-500",
  active_session: "bg-purple-500",
  recommendation: "bg-blue-500",
  xp_drop: "bg-amber-500",
  error: "bg-red-500",
}

const STATUS_LABELS = {
  ok: "System OK",
  active_session: "Session Active",
  recommendation: "Recommendation Ready",
  xp_drop: "XP Available",
  error: "System Error",
}

interface SageBeaconProps {
  status: SystemStatus
}

export function SageBeacon({ status }: SageBeaconProps) {
  return (
    <div className="relative flex items-center gap-2 group">
      <div className="relative">
        <motion.div
          className={`w-2 h-2 rounded-full ${STATUS_COLORS[status]}`}
          animate={{
            scale: status === "active_session" || status === "xp_drop" ? [1, 1.2, 1] : 1,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className={`absolute inset-0 rounded-full ${STATUS_COLORS[status]} opacity-50 blur-sm`}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0.2, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
      <span className="text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        {STATUS_LABELS[status]}
      </span>
    </div>
  )
}
