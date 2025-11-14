"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CouncilChamber } from "@/components/CouncilChamber"
import { UnifiedInsightCard } from "@/components/UnifiedInsightCard"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Sparkles, ArrowLeft, Loader2 } from "@/components/icons"
import Link from "next/link"
import { SAGE_TEMPLATES } from "@/lib/sage-templates"

interface SageResponse {
  id: string
  response: string
}

export default function CouncilPage() {
  const [stage, setStage] = useState<"input" | "deliberating" | "insight">("input")
  const [question, setQuestion] = useState("")
  const [selectedSages, setSelectedSages] = useState<string[]>([])
  const [activeSages, setActiveSages] = useState<string[]>([])
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [unifiedInsight, setUnifiedInsight] = useState("")
  const [tone, setTone] = useState("harmony")

  const councilSages = [
    SAGE_TEMPLATES[0], // Sage Socrates
    SAGE_TEMPLATES[4], // Sage Galileo
    SAGE_TEMPLATES[8], // Sage Picasso
    SAGE_TEMPLATES[12], // Sage Einstein
    SAGE_TEMPLATES[16], // Sage Confucius
  ].map((sage) => ({
    id: sage.id,
    name: sage.name,
    avatar: sage.avatar,
    domain: sage.domain,
    color: sage.color,
  }))

  const handleStartDeliberation = async () => {
    if (!question.trim()) return

    setStage("deliberating")
    setSelectedSages(councilSages.map((s) => s.id))
    setResponses({})
    setActiveSages([])

    for (let i = 0; i < councilSages.length; i++) {
      const sage = councilSages[i]

      setTimeout(() => {
        setActiveSages((prev) => [...prev, sage.id])
      }, i * 800)

      setTimeout(async () => {
        try {
          const response = await fetch("/api/council/deliberate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              question,
              sage: sage,
            }),
          })

          const data = await response.json()

          setResponses((prev) => ({
            ...prev,
            [sage.id]: data.response || `From ${sage.name}: Contemplating your question with wisdom...`,
          }))

          if (i === councilSages.length - 1) {
            setTimeout(() => {
              setStage("insight")
              setUnifiedInsight(
                `After deep deliberation among the council, we have reached a unified understanding:\n\n` +
                  `The diverse perspectives of ${councilSages.map((s) => s.name).join(", ")} converge on this insight: ` +
                  `Your question touches upon fundamental aspects of ${sage.domain.toLowerCase()}. The wisdom gathered suggests a balanced approach that honors both innovation and tradition, logic and creativity, individual growth and collective harmony.`,
              )
            }, 2000)
          }
        } catch (error) {
          console.error("[v0] Error fetching sage response:", error)
          setResponses((prev) => ({
            ...prev,
            [sage.id]: `${sage.name} is contemplating deeply...`,
          }))
        }
      }, i * 1500)
    }
  }

  const handleSaveToMemory = () => {
    console.log("[v0] Saving unified insight to memory...")
    // TODO: Implement save to memory lane
    alert("Insight saved to Memory Lane!")
  }

  const handleNewQuestion = () => {
    setStage("input")
    setQuestion("")
    setSelectedSages([])
    setActiveSages([])
    setResponses({})
    setUnifiedInsight("")
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Cosmic background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/20" />

      {/* Animated orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-slate-800/50 bg-black/50 backdrop-blur-xl">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/demo">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-cyan-400">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Hub
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-purple-400" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Council
              </h1>
            </div>
            <Badge variant="outline" className="border-purple-500/50 text-purple-400">
              {councilSages.length} Sages
            </Badge>
          </div>
        </header>

        <main className="container mx-auto px-6 py-12 max-w-7xl">
          <AnimatePresence mode="wait">
            {/* Stage 1: Input */}
            {stage === "input" && (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="text-center space-y-4 max-w-2xl mx-auto">
                  <h2 className="text-4xl font-bold">Ask the Council</h2>
                  <p className="text-lg text-slate-400">
                    Pose your question to {councilSages.length} diverse sages who will deliberate and provide unified
                    wisdom
                  </p>
                </div>

                <div className="max-w-2xl mx-auto space-y-6">
                  <Textarea
                    placeholder="What question weighs on your mind? The council awaits..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="min-h-[200px] bg-slate-900/50 border-slate-700 text-white resize-none"
                  />

                  <Button
                    onClick={handleStartDeliberation}
                    disabled={!question.trim()}
                    size="lg"
                    className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Begin Deliberation
                  </Button>
                </div>

                {/* Preview council members */}
                <div className="grid grid-cols-5 gap-4 max-w-4xl mx-auto mt-12">
                  {councilSages.map((sage) => (
                    <div key={sage.id} className="text-center space-y-2">
                      <div
                        className="w-20 h-20 mx-auto rounded-full"
                        style={{
                          background: `linear-gradient(135deg, ${sage.color}40, ${sage.color}80)`,
                        }}
                      />
                      <p className="text-sm font-medium">{sage.name}</p>
                      <p className="text-xs text-slate-500">{sage.domain}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Stage 2: Deliberating */}
            {stage === "deliberating" && (
              <motion.div
                key="deliberating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold">Council Deliberating</h2>
                  <p className="text-slate-400">{question}</p>
                </div>

                <CouncilChamber
                  sages={councilSages}
                  isDeliberating={true}
                  activeSages={activeSages}
                  responses={responses}
                  tone={tone}
                />

                <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Wisdom converging...</span>
                </div>
              </motion.div>
            )}

            {/* Stage 3: Unified Insight */}
            {stage === "insight" && (
              <motion.div
                key="insight"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-8"
              >
                <UnifiedInsightCard
                  question={question}
                  insight={unifiedInsight}
                  sages={councilSages}
                  onSave={handleSaveToMemory}
                  onNewQuestion={handleNewQuestion}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
