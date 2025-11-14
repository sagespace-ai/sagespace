"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Shuffle, Users } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface SageSwitchProps {
  activeSage?: {
    id: string
    name: string
    avatar: string
  }
  onSwitch?: () => void
  onSpin?: () => void
  onCouncil?: () => void
}

export function SageSwitch({ activeSage, onSwitch, onSpin, onCouncil }: SageSwitchProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2 text-slate-300 hover:bg-purple-500/10 hover:text-cyan-400"
      >
        {activeSage ? (
          <>
            <Avatar className="h-5 w-5 border border-purple-500/50">
              <AvatarFallback className="text-xs bg-purple-900/50">
                {activeSage.avatar}
              </AvatarFallback>
            </Avatar>
            <span className="max-w-[100px] truncate">{activeSage.name}</span>
          </>
        ) : (
          <span>Select Sage</span>
        )}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-2 w-48 rounded-lg border border-purple-500/20 bg-black/95 backdrop-blur-xl shadow-xl"
          >
            <div className="p-2 space-y-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 text-slate-300 hover:bg-purple-500/10"
                onClick={() => {
                  onSwitch?.()
                  setIsOpen(false)
                }}
              >
                <Users className="h-4 w-4" />
                Switch Sage
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 text-slate-300 hover:bg-purple-500/10"
                onClick={() => {
                  onSpin?.()
                  setIsOpen(false)
                }}
              >
                <Shuffle className="h-4 w-4" />
                Spin Random
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 text-slate-300 hover:bg-purple-500/10"
                onClick={() => {
                  onCouncil?.()
                  setIsOpen(false)
                }}
              >
                <Users className="h-4 w-4" />
                Council Mode
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
