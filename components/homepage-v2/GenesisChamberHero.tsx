'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
// Import SageAvatar directly from component file
import { SageAvatar } from '@/components/sage-avatar/SageAvatar'
import { Sparkles, Zap } from 'lucide-react'

export function GenesisChamberHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Cosmic background layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/20 via-black to-black" />
      
      {/* Animated portal effect */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
      >
        <div className="relative w-[600px] h-[600px]">
          {/* Portal rings */}
          {[1, 2, 3].map((ring) => (
            <motion.div
              key={ring}
              className="absolute inset-0 rounded-full border-2"
              style={{
                borderColor: `rgba(168, 85, 247, ${0.4 / ring})`,
                transform: `scale(${ring * 0.3})`,
              }}
              animate={{
                rotate: ring % 2 === 0 ? 360 : -360,
                scale: [ring * 0.3, ring * 0.35, ring * 0.3],
              }}
              transition={{
                rotate: { duration: 20 / ring, repeat: Infinity, ease: 'linear' },
                scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
              }}
            />
          ))}
          
          {/* Central glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full blur-3xl opacity-60 animate-pulse-slow" />
          </div>
        </div>
      </motion.div>

      {/* Floating Sage Avatar */}
      <motion.div
        className="absolute right-[15%] top-1/2 -translate-y-1/2"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      >
        <SageAvatar
          archetype="strategist"
          evolutionStage={3}
          emotion="confident"
          size={200}
          className="animate-float"
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h1 className="text-7xl md:text-8xl font-bold mb-6 text-balance">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              Enter the Cosmos
            </span>
          </h1>
          
          <p className="text-2xl md:text-3xl text-gray-300 mb-12 text-pretty">
            Begin your journey through the{' '}
            <span className="text-cyan-400 font-semibold">Genesis Chamber</span>
            {' '}and awaken your personal Sage
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/genesis">
              <motion.button
                className="group relative px-10 py-5 text-lg font-bold rounded-2xl overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 transition-all group-hover:from-cyan-400 group-hover:to-purple-400" />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                <span className="relative flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Enter Genesis Chamber
                </span>
              </motion.button>
            </Link>

            <Link href="/universe-map">
              <motion.button
                className="group px-10 py-5 text-lg font-bold rounded-2xl border-2 border-purple-500/50 hover:border-cyan-400 bg-black/50 backdrop-blur-sm transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Explore Sage Galaxy
                </span>
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
