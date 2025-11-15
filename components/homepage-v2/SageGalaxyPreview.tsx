'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'

export function SageGalaxyPreview() {
  const [hoveredPlanet, setHoveredPlanet] = useState<number | null>(null)

  const planets = [
    { name: 'Strategist Core', color: 'cyan', position: { x: '30%', y: '40%' } },
    { name: 'Dreamer Nebula', color: 'purple', position: { x: '70%', y: '30%' } },
    { name: 'Warrior Station', color: 'red', position: { x: '50%', y: '70%' } },
    { name: 'Scholar Realm', color: 'emerald', position: { x: '20%', y: '65%' } },
    { name: 'Shadow Gate', color: 'violet', position: { x: '80%', y: '60%' } },
  ]

  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-cyan-950/10 to-black" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Navigate the Sage Galaxy
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            A living universe map with constellations, Sage planets, and cosmic portals
          </p>
        </motion.div>

        {/* Interactive Galaxy Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative h-[600px] rounded-3xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border-2 border-purple-500/30 overflow-hidden"
        >
          {/* Central star */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32"
            animate={{
              scale: [1, 1.2, 1],
              rotate: 360,
            }}
            transition={{
              scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
              rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
            }}
          >
            <div className="w-full h-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 blur-2xl opacity-80" />
            <div className="absolute inset-4 rounded-full bg-gradient-to-r from-yellow-300 to-orange-400" />
          </motion.div>

          {/* Orbiting planets */}
          {planets.map((planet, index) => (
            <motion.div
              key={planet.name}
              className="absolute cursor-pointer"
              style={{ left: planet.position.x, top: planet.position.y }}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.3 }}
              onHoverStart={() => setHoveredPlanet(index)}
              onHoverEnd={() => setHoveredPlanet(null)}
            >
              <div className={`w-16 h-16 rounded-full bg-${planet.color}-500 relative`}>
                <div className={`absolute inset-0 rounded-full bg-${planet.color}-400 animate-ping-slow`} />
                <div className={`absolute inset-0 rounded-full bg-${planet.color}-500 shadow-lg shadow-${planet.color}-500/50`} />
              </div>
              
              {hoveredPlanet === index && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-20 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/90 px-4 py-2 rounded-lg border border-purple-500/50 text-sm"
                >
                  {planet.name}
                </motion.div>
              )}
            </motion.div>
          ))}

          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
            <motion.line
              x1="50%"
              y1="50%"
              x2="30%"
              y2="40%"
              stroke="url(#gradient1)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 1.5 }}
            />
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/universe-map">
            <motion.button
              className="px-10 py-5 text-lg font-bold rounded-2xl border-2 border-cyan-500 hover:bg-cyan-500/10 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Full Galaxy
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
