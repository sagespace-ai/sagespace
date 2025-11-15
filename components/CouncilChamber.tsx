"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SageOrb } from "./SageOrb"
import { getToneGradient } from "@/lib/councilTone"

interface Sage {
  id: string
  name: string
  avatar: string
  domain: string
  color: string
}

interface CouncilChamberProps {
  sages: Sage[]
  isDeliberating: boolean
  activeSages: string[]
  responses: Record<string, string>
  tone?: string
}

export function CouncilChamber({
  sages = [], // Add default empty array to prevent undefined error
  isDeliberating,
  activeSages = [], // Add default empty array
  responses = {}, // Add default empty object
  tone = "harmony",
}: CouncilChamberProps) {
  const [gradient, setGradient] = useState(getToneGradient(tone))

  useEffect(() => {
    setGradient(getToneGradient(tone))
  }, [tone])

  // Calculate circular positions for sages
  const getOrbPosition = (index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2 // Start from top
    const radius = 35 // Percentage from center
    return {
      x: 50 + radius * Math.cos(angle),
      y: 50 + radius * Math.sin(angle),
    }
  }

  return (
    <div className="relative w-full h-[600px] rounded-3xl overflow-hidden">
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: gradient,
        }}
        transition={{ duration: 2 }}
        style={{
          opacity: 0.1,
        }}
      />

      {/* Holographic rings */}
      {isDeliberating && (
        <>
          <motion.div
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-purple-500/30"
            style={{ width: "300px", height: "300px" }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-cyan-500/30"
            style={{ width: "400px", height: "400px" }}
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
        </>
      )}

      {/* Center energy orb during convergence */}
      {isDeliberating && activeSages.length === sages.length && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <motion.div
            className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-500/40 via-pink-500/40 to-cyan-500/40 backdrop-blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        </motion.div>
      )}

      {/* Sage orbs arranged in circle */}
      <AnimatePresence>
        {sages.map((sage, index) => {
          const position = getOrbPosition(index, sages.length)
          const isActive = activeSages.includes(sage.id)
          const isSpeaking = !!responses[sage.id]
          const response = responses[sage.id]

          return (
            <SageOrb
              key={sage.id}
              sage={sage}
              isActive={isActive}
              isSpeaking={isSpeaking}
              response={response}
              position={position}
              delay={index * 0.2}
            />
          )
        })}
      </AnimatePresence>

      {/* Starfield effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  )
}
