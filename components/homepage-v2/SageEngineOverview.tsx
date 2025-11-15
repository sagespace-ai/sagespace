'use client'

import { motion } from 'framer-motion'
import { Target, Layers, Trophy, Zap } from 'lucide-react'
import Link from 'next/link'

const features = [
  {
    icon: Target,
    title: 'Cosmic Trials',
    description: 'Challenge your Sages with increasingly difficult trials across multiple difficulty modes',
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    icon: Layers,
    title: 'Sage Evolution',
    description: 'Watch your Sages transform from Embers of Form to Cosmic Sovereigns through progression',
    gradient: 'from-purple-500 to-pink-600',
  },
  {
    icon: Trophy,
    title: 'Cosmic Artifacts',
    description: 'Collect rare artifacts and power-ups that enhance your Sage abilities',
    gradient: 'from-yellow-500 to-orange-600',
  },
  {
    icon: Zap,
    title: 'Dynamic Difficulty',
    description: 'Adaptive challenge system that grows with your skill level',
    gradient: 'from-green-500 to-teal-600',
  },
]

export function SageEngineOverview() {
  return (
    <section className="relative py-32 px-6">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/10 to-black" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              The Sage Engine
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            A living system of challenges, evolution, and cosmic progression
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="group relative p-8 rounded-3xl bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border-2 border-purple-500/20 hover:border-cyan-400/60 transition-all duration-300"
            >
              {/* Card glow effect */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${feature.gradient} opacity-10 blur-xl`} />
              </div>

              <div className="relative">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} p-4 mb-6`}>
                  <feature.icon className="w-full h-full text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                <p className="text-gray-400 text-lg leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <Link href="/playground">
            <motion.button
              className="px-10 py-5 text-lg font-bold rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg shadow-purple-500/50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Launch Sage Engine
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
