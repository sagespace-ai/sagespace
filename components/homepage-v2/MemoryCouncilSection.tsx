'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { History, Users } from 'lucide-react'

export function MemoryCouncilSection() {
  return (
    <section className="relative py-32 px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-cyan-950/10 to-black" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Memory Lane */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            whileHover={{ scale: 1.02 }}
            className="group relative p-12 rounded-3xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border-2 border-purple-500/30 hover:border-cyan-400/60 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 p-5 mb-6">
                <History className="w-full h-full text-white" />
              </div>
              
              <h3 className="text-4xl font-bold mb-4">Memory Lane</h3>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Journey through your cosmic timeline. Every conversation, trial, and evolution preserved in the fabric of space-time.
              </p>
              
              <Link href="/memory">
                <motion.button
                  className="px-8 py-4 rounded-xl bg-cyan-500/20 border-2 border-cyan-500/50 hover:bg-cyan-500/30 hover:border-cyan-400 transition-all font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore Timeline
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Council Arena */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            whileHover={{ scale: 1.02 }}
            className="group relative p-12 rounded-3xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border-2 border-purple-500/30 hover:border-purple-400/60 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 p-5 mb-6">
                <Users className="w-full h-full text-white" />
              </div>
              
              <h3 className="text-4xl font-bold mb-4">Council Arena</h3>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Witness cosmic debates between multiple Sages. Watch different perspectives collide and synthesize into profound wisdom.
              </p>
              
              <Link href="/council">
                <motion.button
                  className="px-8 py-4 rounded-xl bg-purple-500/20 border-2 border-purple-500/50 hover:bg-purple-500/30 hover:border-purple-400 transition-all font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Enter Council
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
