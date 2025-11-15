"use client"

import { motion } from "framer-motion"
import { SageArchetype } from "@/lib/sage-galaxy/types"

interface CoreStarProps {
  archetype: SageArchetype
  level: number
  streak: number
  onClick: () => void
}

const archetypeColors: Record<SageArchetype, string> = {
  strategist: "from-blue-500 to-cyan-400",
  dreamer: "from-purple-500 to-pink-400",
  warrior: "from-red-500 to-orange-400",
  scholar: "from-green-500 to-emerald-400",
  shadowwalker: "from-indigo-600 to-purple-500",
}

export function CoreStar({ archetype, level, streak, onClick }: CoreStarProps) {
  return (
    <motion.button
      onClick={onClick}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative">
        {/* Pulse rings */}
        <motion.div
          className={`absolute inset-0 w-32 h-32 rounded-full bg-gradient-to-r ${archetypeColors[archetype]} opacity-20`}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.05, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          className={`absolute inset-0 w-32 h-32 rounded-full bg-gradient-to-r ${archetypeColors[archetype]} opacity-10`}
          animate={{
            scale: [1, 2, 1],
            opacity: [0.1, 0, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        {/* Core star */}
        <div className={`relative w-32 h-32 rounded-full bg-gradient-to-br ${archetypeColors[archetype]} shadow-2xl flex items-center justify-center`}>
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
          <div className="text-5xl">⭐</div>
        </div>

        {/* Level indicator */}
        <div className="absolute -top-2 -right-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full w-10 h-10 flex items-center justify-center border-4 border-black shadow-lg">
          <span className="text-white font-bold text-sm">{level}</span>
        </div>

        {/* Streak indicator */}
        {streak > 0 && (
          <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-full px-3 py-1 flex items-center gap-1 border-2 border-black shadow-lg">
            <span className="text-xs">🔥</span>
            <span className="text-white font-bold text-sm">{streak}</span>
          </div>
        )}

        {/* Hover tooltip */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-black/90 backdrop-blur-sm border border-cyan-500/50 rounded-lg px-4 py-2 whitespace-nowrap">
            <p className="text-white font-semibold capitalize">{archetype} Core</p>
            <p className="text-cyan-400 text-sm">Level {level} • {streak} day streak</p>
          </div>
        </div>
      </div>
    </motion.button>
  )
}
