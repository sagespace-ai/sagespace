'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Check, Sparkles } from 'lucide-react'

const tiers = [
  {
    name: 'Explorer',
    price: '$9',
    description: 'Begin your cosmic journey',
    features: ['5 Active Sages', 'Basic Trials', 'Memory Lane Access', 'Community Council'],
    gradient: 'from-cyan-500 to-blue-600',
    popular: false,
  },
  {
    name: 'Voyager',
    price: '$29',
    description: 'Unlock the full cosmos',
    features: ['Unlimited Sages', 'Advanced Trials', 'Full Galaxy Map', 'Private Councils', 'Priority Support'],
    gradient: 'from-purple-500 to-pink-600',
    popular: true,
  },
  {
    name: 'Astral',
    price: '$99',
    description: 'Transcend the boundaries',
    features: ['Everything in Voyager', 'Custom Sage Creation', 'API Access', 'White-glove Onboarding', '1-on-1 Strategy Sessions'],
    gradient: 'from-yellow-500 to-orange-600',
    popular: false,
  },
]

export function SubscriptionTeaser() {
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
              Choose Your Path
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Select the tier that matches your cosmic ambitions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className={`relative p-8 rounded-3xl bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border-2 ${
                tier.popular ? 'border-purple-500 shadow-2xl shadow-purple-500/20' : 'border-purple-500/20'
              } transition-all duration-300`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-sm font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Most Popular
                </div>
              )}

              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${tier.gradient} p-4 mb-6`}>
                <div className="w-full h-full rounded-full bg-white/20" />
              </div>

              <h3 className="text-3xl font-bold mb-2">{tier.name}</h3>
              <div className="text-4xl font-bold mb-2">
                {tier.price}
                <span className="text-lg text-gray-400">/mo</span>
              </div>
              <p className="text-gray-400 mb-8">{tier.description}</p>

              <ul className="space-y-4 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/billing">
                <motion.button
                  className={`w-full py-4 rounded-xl font-bold transition-all ${
                    tier.popular
                      ? `bg-gradient-to-r ${tier.gradient} hover:shadow-lg`
                      : 'bg-slate-700/50 hover:bg-slate-700 border-2 border-slate-600'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get Started
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
