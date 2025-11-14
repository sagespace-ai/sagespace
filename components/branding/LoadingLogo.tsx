"use client"

import { motion, useReducedMotion } from "framer-motion"

interface LoadingLogoProps {
  message?: string
}

export function LoadingLogo({ message = "Loading your universe..." }: LoadingLogoProps) {
  const shouldReduceMotion = useReducedMotion()

  const containerVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  const spiralVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "linear",
      },
    },
  }

  const pulseVariants = {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.5, 0.8, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="flex flex-col items-center justify-center gap-6 p-8"
    >
      {/* Logo with animated glow */}
      <div className="relative w-20 h-20">
        {/* Pulsing glow effect */}
        {!shouldReduceMotion && (
          <motion.div
            variants={pulseVariants}
            animate="animate"
            className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full blur-3xl"
            style={{ width: 120, height: 120, left: -20, top: -20 }}
          />
        )}

        {/* Rotating spiral logo */}
        <motion.div
          variants={shouldReduceMotion ? undefined : spiralVariants}
          animate={shouldReduceMotion ? undefined : "animate"}
          className="relative z-10"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="loadingSpiralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="50%" stopColor="#A78BFA" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
              <filter id="loadingGlow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Sacred geometry spiral path */}
            <path
              d="M 50 50 Q 55 45, 60 45 Q 70 45, 75 55 Q 80 70, 70 80 Q 50 90, 35 75 Q 20 55, 35 40 Q 55 25, 70 40"
              fill="none"
              stroke="url(#loadingSpiralGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              filter="url(#loadingGlow)"
            />

            {/* Inner wisdom dot */}
            <circle
              cx="50"
              cy="50"
              r="4"
              fill="url(#loadingSpiralGradient)"
              filter="url(#loadingGlow)"
            />

            {/* Sage orbs */}
            <circle
              cx="30"
              cy="30"
              r="6"
              fill="none"
              stroke="#60A5FA"
              strokeWidth="2"
              opacity="0.8"
            />
            <circle cx="30" cy="30" r="2" fill="#60A5FA" opacity="0.6" />

            <circle
              cx="70"
              cy="30"
              r="6"
              fill="none"
              stroke="#A78BFA"
              strokeWidth="2"
              opacity="0.8"
            />
            <circle cx="70" cy="30" r="2" fill="#A78BFA" opacity="0.6" />
          </svg>
        </motion.div>
      </div>

      {/* Loading message */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-lg text-slate-300 text-center"
      >
        {message}
      </motion.p>

      {/* Loading dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.3 }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"
          />
        ))}
      </div>
    </motion.div>
  )
}
