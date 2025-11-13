"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface SageOrbProps {
  sage: {
    id: string
    name: string
    avatar: string
    domain: string
    color: string
  }
  isActive: boolean
  isSpeaking: boolean
  response?: string
  position: { x: number; y: number }
  delay: number
}

export function SageOrb({ sage, isActive, isSpeaking, response, position, delay }: SageOrbProps) {
  const [showResponse, setShowResponse] = useState(false)

  useEffect(() => {
    if (response) {
      setShowResponse(true)
    }
  }, [response])

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, type: "spring" }}
      className="absolute"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: "translate(-50%, -50%)",
      }}
    >
      {/* Orb container */}
      <div className="relative">
        {/* Outer glow rings */}
        {isActive && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full blur-xl opacity-40"
              style={{
                backgroundColor: sage.color,
                width: "120px",
                height: "120px",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
              animate={{
                scale: isSpeaking ? [1, 1.3, 1] : 1,
                opacity: isSpeaking ? [0.4, 0.6, 0.4] : 0.4,
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full blur-2xl opacity-20"
              style={{
                backgroundColor: sage.color,
                width: "160px",
                height: "160px",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
              animate={{
                scale: isSpeaking ? [1, 1.5, 1] : 1,
                opacity: isSpeaking ? [0.2, 0.4, 0.2] : 0.2,
              }}
              transition={{
                duration: 2.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 0.2,
              }}
            />
          </>
        )}

        {/* Main orb */}
        <motion.div
          className="relative w-20 h-20 rounded-full flex items-center justify-center backdrop-blur-sm border-2"
          style={{
            backgroundColor: `${sage.color}20`,
            borderColor: sage.color,
            boxShadow: `0 0 30px ${sage.color}40`,
          }}
          animate={{
            scale: isSpeaking ? [1, 1.1, 1] : 1,
            boxShadow: isSpeaking
              ? [`0 0 30px ${sage.color}40`, `0 0 50px ${sage.color}80`, `0 0 30px ${sage.color}40`]
              : `0 0 30px ${sage.color}40`,
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <span className="text-3xl">{sage.avatar}</span>

          {/* Waveform indicator when speaking */}
          {isSpeaking && (
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 rounded-full"
                  style={{ backgroundColor: sage.color }}
                  animate={{
                    height: ["8px", "16px", "8px"],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: i * 0.1,
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Sage name label */}
        <motion.div
          className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.3 }}
        >
          <div
            className="text-xs font-medium text-white text-center px-2 py-1 rounded-lg backdrop-blur-sm"
            style={{ backgroundColor: `${sage.color}20`, borderColor: `${sage.color}40` }}
          >
            {sage.name}
          </div>
        </motion.div>

        {/* Speech bubble */}
        {showResponse && response && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="absolute top-24 left-1/2 transform -translate-x-1/2 w-64 p-4 rounded-2xl backdrop-blur-xl border-2 shadow-2xl"
            style={{
              backgroundColor: `${sage.color}10`,
              borderColor: `${sage.color}60`,
            }}
          >
            <div className="text-xs text-white/90 leading-relaxed">{response}</div>
            {/* Pointer */}
            <div
              className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45 border-t-2 border-l-2"
              style={{
                backgroundColor: `${sage.color}10`,
                borderColor: `${sage.color}60`,
              }}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
