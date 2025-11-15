"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { SagePlanet as SagePlanetType } from "@/lib/sage-galaxy/types"

interface SagePlanetProps {
  planet: SagePlanetType
  onClick: (planet: SagePlanetType) => void
  centerX: number
  centerY: number
  time: number
}

export function SagePlanet({ planet, onClick, centerX, centerY, time }: SagePlanetProps) {
  const angle = planet.currentAngle + time * planet.orbitSpeed
  const x = centerX + Math.cos(angle) * planet.orbitRadius
  const y = centerY + Math.sin(angle) * planet.orbitRadius

  return (
    <motion.button
      onClick={() => onClick(planet)}
      className="absolute z-40"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%)',
      }}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
    >
      <div className="relative group">
        {/* Orbit path hint */}
        <div
          className="absolute rounded-full border border-white/5 pointer-events-none"
          style={{
            width: `${planet.orbitRadius * 2}px`,
            height: `${planet.orbitRadius * 2}px`,
            left: `${centerX - x}px`,
            top: `${centerY - y}px`,
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* Planet glow */}
        <div
          className="absolute inset-0 w-16 h-16 rounded-full blur-xl opacity-40"
          style={{ backgroundColor: planet.color }}
        />

        {/* Planet */}
        <div
          className="relative w-16 h-16 rounded-full flex items-center justify-center border-4 border-black/50 shadow-2xl"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${planet.color}dd, ${planet.color}44)`,
          }}
        >
          <span className="text-3xl">{planet.avatar}</span>

          {/* Evolution rings */}
          {planet.evolutionStage > 1 && (
            <div className="absolute -inset-2 rounded-full border-2 border-white/20" />
          )}
          {planet.evolutionStage > 2 && (
            <div className="absolute -inset-4 rounded-full border border-white/10" />
          )}
        </div>

        {/* Bond level */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full px-2 py-0.5 border-2 border-black text-xs font-bold text-white shadow-lg">
          {planet.bondLevel}%
        </div>

        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-black/90 backdrop-blur-sm border border-cyan-500/50 rounded-lg px-4 py-3 whitespace-nowrap">
            <p className="text-white font-semibold">{planet.sageName}</p>
            <p className="text-cyan-400 text-sm capitalize">{planet.archetype}</p>
            <p className="text-purple-400 text-xs">Stage {planet.evolutionStage} • Bond {planet.bondLevel}%</p>
          </div>
        </div>
      </div>
    </motion.button>
  )
}
