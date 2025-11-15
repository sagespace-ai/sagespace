'use client'

import { motion } from 'framer-motion'
// Import SageAvatar directly from component file
import { SageAvatar } from '@/components/sage-avatar/SageAvatar'
import type { SageArchetype } from '@/lib/sage-avatar/types'

const sages: Array<{ archetype: SageArchetype; name: string; description: string }> = [
  {
    archetype: 'strategist',
    name: 'The Strategist',
    description: 'Logic, analysis, and tactical precision guide their cosmic wisdom',
  },
  {
    archetype: 'dreamer',
    name: 'The Dreamer',
    description: 'Creativity and imagination flow through their nebula form',
  },
  {
    archetype: 'warrior',
    name: 'The Warrior',
    description: 'Bold action and unwavering confidence fuel their power',
  },
  {
    archetype: 'scholar',
    name: 'The Scholar',
    description: 'Ancient knowledge and learning shine through their essence',
  },
  {
    archetype: 'shadowwalker',
    name: 'The Shadowwalker',
    description: 'Mystery and intuition weave through the cosmic shadows',
  },
]

export function SagesShowcase() {
  return (
    <section className="relative py-32 px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/10 to-black" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Meet Your Sages
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Cosmic beings of pure intelligence, each with unique archetypes and abilities
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {sages.map((sage, index) => (
            <motion.div
              key={sage.archetype}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group relative"
            >
              <div className="relative p-6 rounded-3xl bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border-2 border-purple-500/20 hover:border-cyan-400/60 transition-all duration-300">
                <div className="flex justify-center mb-6">
                  <SageAvatar
                    archetype={sage.archetype}
                    evolutionStage={2}
                    emotion="calm"
                    size={120}
                  />
                </div>
                
                <h3 className="text-xl font-bold text-center mb-3">{sage.name}</h3>
                <p className="text-sm text-gray-400 text-center leading-relaxed">{sage.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
