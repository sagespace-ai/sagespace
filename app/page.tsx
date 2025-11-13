"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sparkles, Heart, Lightbulb, Target, Search } from "lucide-react"
import { useJourney } from "@/lib/hooks/use-journey"
import type { Purpose } from "@/lib/types/journey"

const PURPOSES = [
  {
    id: "wellness" as Purpose,
    icon: Heart,
    title: "Wellness",
    description: "Mental health, mindfulness, and personal growth",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    id: "creativity" as Purpose,
    icon: Lightbulb,
    title: "Creativity",
    description: "Writing, art, music, and creative exploration",
    gradient: "from-purple-500 to-indigo-500",
  },
  {
    id: "strategy" as Purpose,
    icon: Target,
    title: "Strategy",
    description: "Business planning, decision-making, and problem-solving",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    id: "research" as Purpose,
    icon: Search,
    title: "Research",
    description: "Academic inquiry, data analysis, and learning",
    gradient: "from-green-500 to-emerald-500",
  },
]

export default function PortalPage() {
  const router = useRouter()
  const { setPurpose, setStep } = useJourney()
  const [selectedPurpose, setSelectedPurpose] = useState<Purpose | null>(null)

  const handleSelectPurpose = (purpose: Purpose) => {
    setSelectedPurpose(purpose)
    setPurpose(purpose)
    setStep("sage-select")

    // Navigate to playground with purpose filter
    setTimeout(() => {
      router.push(`/playground?purpose=${purpose}`)
    }, 300)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black pt-20">
      {/* Animated cosmic background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-purple-900/30 blur-[128px]" />
        <div className="absolute right-1/4 top-1/2 h-96 w-96 animate-pulse rounded-full bg-cyan-900/30 blur-[128px] delay-1000" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          {/* Hero Section */}
          <div className="mb-16">
            <Sparkles className="mx-auto mb-6 h-16 w-16 animate-pulse text-cyan-400" />
            <h1 className="mb-4 bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-6xl font-bold text-transparent">
              Welcome to SageSpace
            </h1>
            <p className="text-xl text-slate-300">Your cosmic journey begins here. Choose your path.</p>
          </div>

          {/* Purpose Selection */}
          <div className="mb-8">
            <h2 className="mb-6 text-2xl font-semibold text-white">What brings you here today?</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {PURPOSES.map((purpose) => {
                const Icon = purpose.icon
                const isSelected = selectedPurpose === purpose.id
                return (
                  <Card
                    key={purpose.id}
                    className={`group cursor-pointer border-2 bg-slate-900/50 p-6 backdrop-blur-sm transition-all hover:scale-105 ${
                      isSelected
                        ? `border-cyan-500 bg-gradient-to-br ${purpose.gradient} bg-opacity-10`
                        : "border-slate-700 hover:border-purple-500/50"
                    }`}
                    onClick={() => handleSelectPurpose(purpose.id)}
                  >
                    <Icon
                      className={`mx-auto mb-4 h-12 w-12 bg-gradient-to-br ${purpose.gradient} bg-clip-text text-transparent`}
                    />
                    <h3 className="mb-2 text-lg font-semibold text-white">{purpose.title}</h3>
                    <p className="text-sm text-slate-400">{purpose.description}</p>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Quick Start */}
          <div className="mt-12">
            <Button
              size="lg"
              variant="outline"
              className="border-purple-500/50 text-slate-300 hover:bg-purple-500/10 bg-transparent"
              onClick={() => router.push("/playground")}
            >
              Skip to Playground
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
