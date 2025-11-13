"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { BookmarkIcon, SparklesIcon, Share2Icon } from "@/components/icons"

interface UnifiedInsightCardProps {
  title: string
  content: string
  keywords?: string[]
  onSave: () => void
  onRegenerate: () => void
  onShare?: () => void
}

export function UnifiedInsightCard({
  title,
  content,
  keywords = [],
  onSave,
  onRegenerate,
  onShare,
}: UnifiedInsightCardProps) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, y: 50 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 150, damping: 20 }}
      className="relative"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-cyan-500/30 rounded-3xl blur-2xl" />

      {/* Card content */}
      <div className="relative bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-2xl border-2 border-purple-500/50 rounded-3xl p-8 shadow-2xl">
        {/* Animated border shine */}
        <motion.div
          className="absolute inset-0 rounded-3xl opacity-50"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.4), transparent)",
          }}
          animate={{
            x: ["-100%", "200%"],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />

        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="p-4 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-2xl">
            <SparklesIcon className="w-8 h-8 text-purple-400" />
          </div>
          <div className="flex-1">
            <motion.h2
              className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              style={{
                backgroundSize: "200% 200%",
              }}
            >
              {title}
            </motion.h2>
            <p className="text-sm text-slate-400">Synthesized from {keywords.length} council perspectives</p>
          </div>
        </div>

        {/* Content */}
        <div className="mb-6 p-6 bg-slate-800/50 rounded-2xl border border-slate-700">
          <p className="text-white/90 leading-relaxed text-lg">{content}</p>
        </div>

        {/* Keywords */}
        {keywords.length > 0 && (
          <div className="mb-6">
            <div className="text-sm text-slate-400 mb-3">Key Themes:</div>
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 rounded-full text-sm text-purple-300"
                >
                  {keyword}
                </motion.span>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={onSave}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-6 text-lg font-semibold"
          >
            <BookmarkIcon className="w-5 h-5 mr-2" />
            Save to Memory Lane
          </Button>
          <Button
            onClick={onRegenerate}
            variant="outline"
            className="border-2 border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 py-6 px-8 bg-transparent"
          >
            <SparklesIcon className="w-5 h-5 mr-2" />
            Regenerate
          </Button>
          {onShare && (
            <Button
              onClick={onShare}
              variant="outline"
              className="border-2 border-slate-600 text-slate-300 hover:bg-slate-700 py-6 px-8 bg-transparent"
            >
              <Share2Icon className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
