"use client"

import { motion } from "framer-motion"
import { Constellation, GalaxyNode } from "@/lib/sage-galaxy/types"

interface ConstellationLayerProps {
  constellations: Constellation[]
  selectedConstellation: string | null
  onNodeClick: (node: GalaxyNode) => void
  zoom: number
  cameraX: number
  cameraY: number
}

export function ConstellationLayer({ 
  constellations, 
  selectedConstellation, 
  onNodeClick,
  zoom,
  cameraX,
  cameraY 
}: ConstellationLayerProps) {
  return (
    <div className="absolute inset-0">
      {constellations.map((constellation) => {
        const isSelected = selectedConstellation === constellation.id
        const opacity = selectedConstellation ? (isSelected ? 1 : 0.2) : 0.7

        return (
          <div key={constellation.id} style={{ opacity }}>
            {/* Draw lines between nodes */}
            {constellation.nodes.map((node, i) => {
              const nextNode = constellation.nodes[(i + 1) % constellation.nodes.length]
              const completed = node.status === 'completed' || node.status === 'perfected'
              
              return (
                <svg
                  key={`line-${node.id}`}
                  className="absolute inset-0 pointer-events-none"
                  style={{ width: '100%', height: '100%' }}
                >
                  <motion.line
                    x1={`${node.x + (cameraX / zoom)}%`}
                    y1={`${node.y + (cameraY / zoom)}%`}
                    x2={`${nextNode.x + (cameraX / zoom)}%`}
                    y2={`${nextNode.y + (cameraY / zoom)}%`}
                    stroke={constellation.color}
                    strokeWidth={completed ? "2" : "1"}
                    opacity={completed ? "0.6" : "0.3"}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                </svg>
              )
            })}

            {/* Render nodes */}
            {constellation.nodes.map((node) => (
              <GalaxyNodeComponent
                key={node.id}
                node={node}
                constellation={constellation}
                onClick={() => onNodeClick(node)}
                zoom={zoom}
                cameraX={cameraX}
                cameraY={cameraY}
              />
            ))}
          </div>
        )
      })}
    </div>
  )
}

function GalaxyNodeComponent({ 
  node, 
  constellation,
  onClick,
  zoom,
  cameraX,
  cameraY
}: { 
  node: GalaxyNode
  constellation: Constellation
  onClick: () => void
  zoom: number
  cameraX: number
  cameraY: number
}) {
  const getNodeStyle = () => {
    switch (node.status) {
      case 'completed':
      case 'perfected':
        return {
          bg: constellation.color,
          glow: constellation.glowColor,
          size: 'w-4 h-4',
          opacity: '1',
        }
      case 'in-progress':
        return {
          bg: constellation.color,
          glow: constellation.glowColor,
          size: 'w-3 h-3',
          opacity: '0.8',
        }
      case 'available':
        return {
          bg: constellation.color,
          glow: constellation.glowColor,
          size: 'w-3 h-3',
          opacity: '0.5',
        }
      default:
        return {
          bg: '#6b7280',
          glow: '#9ca3af',
          size: 'w-2 h-2',
          opacity: '0.3',
        }
    }
  }

  const style = getNodeStyle()

  return (
    <motion.button
      onClick={onClick}
      className="absolute"
      style={{
        left: `${node.x + (cameraX / zoom)}%`,
        top: `${node.y + (cameraY / zoom)}%`,
        transform: `translate(-50%, -50%) scale(${1 / zoom})`,
      }}
      whileHover={{ scale: 1.5 }}
      disabled={node.status === 'locked'}
    >
      <div className="relative group">
        {/* Glow effect */}
        <div
          className={`absolute inset-0 ${style.size} rounded-full blur-md`}
          style={{ backgroundColor: style.glow, opacity: style.opacity }}
        />
        
        {/* Node */}
        <div
          className={`relative ${style.size} rounded-full`}
          style={{ backgroundColor: style.bg }}
        >
          {node.status === 'perfected' && (
            <div className="absolute inset-0 flex items-center justify-center text-xs">
              ⭐
            </div>
          )}
        </div>

        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
          <div className="bg-black/90 backdrop-blur-sm border border-cyan-500/50 rounded-lg px-3 py-2 whitespace-nowrap">
            <p className="text-white font-semibold text-sm">{node.name}</p>
            <p className="text-cyan-400 text-xs capitalize">{node.status}</p>
          </div>
        </div>
      </div>
    </motion.button>
  )
}
