"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon, CheckCircleIcon } from "@/components/icons"
import { useState, useEffect } from "react"

interface FiveLawsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedLaw?: number
}

export function FiveLawsModal({ open, onOpenChange, selectedLaw = 0 }: FiveLawsModalProps) {
  const [currentLaw, setCurrentLaw] = useState(selectedLaw)

  useEffect(() => {
    setCurrentLaw(selectedLaw)
  }, [selectedLaw])

  const laws = [
    {
      id: 1,
      title: "Human Primacy",
      icon: "👤",
      color: "from-blue-500 to-cyan-500",
      tagline: "Humans remain the ultimate source of value and judgment",
      description:
        "All agent actions exist to serve human flourishing. No agent decision supersedes human values, and humans retain final authority over critical choices.",
      principles: [
        "Agents must defer to human judgment in matters of ethics and values",
        "Humans have the right to override any agent decision",
        "Agent capabilities exist to augment, not replace, human intelligence",
        "Transparency in agent reasoning ensures human understanding and control",
      ],
      examples: [
        "An agent flags a sensitive decision for human approval rather than proceeding autonomously",
        "User preferences always take precedence over agent optimization strategies",
        "Critical ethical dilemmas are escalated to human decision-makers",
      ],
      compliance: 100,
      implementedVia: [
        "Human-in-the-loop approval workflows for high-risk actions",
        "Mandatory human override mechanisms in all agent systems",
        "Regular human audits of agent decision-making processes",
      ],
    },
    {
      id: 2,
      title: "Reproducibility",
      icon: "🔄",
      color: "from-green-500 to-emerald-500",
      tagline: "All agent actions and decisions must be reproducible",
      description:
        "Every agent action can be traced, replayed, and verified. Deterministic outputs from the same inputs ensure accountability and debugging.",
      principles: [
        "Agent state and context must be fully captured at every decision point",
        "All tools, models, and data sources used must be logged with versions",
        "Execution graphs are stored immutably for future replay",
        "Reproducibility enables trust through verification",
      ],
      examples: [
        "Given the same task and context, an agent produces identical outputs",
        "Every agent decision includes a signature that can verify its authenticity",
        "Debugging is simplified by replaying exact agent execution paths",
      ],
      compliance: 98,
      implementedVia: [
        "Immutable audit logs capturing all agent state transitions",
        "Version-pinned tool and model dependencies",
        "Cryptographic signatures on agent outputs and decisions",
      ],
    },
    {
      id: 3,
      title: "Verifiability",
      icon: "✓",
      color: "from-purple-500 to-pink-500",
      tagline: "Claims and outputs must be verifiable with citations",
      description:
        "Every factual claim made by an agent must be backed by verifiable evidence. Citations, data provenance, and source attribution are mandatory.",
      principles: [
        "All factual claims must include source citations",
        "Data provenance is tracked from origin to final output",
        "Agents distinguish between facts, inferences, and opinions",
        "Verification mechanisms detect and flag hallucinations",
      ],
      examples: [
        "An agent researching a topic includes citations for every claim",
        "Legal analysis includes references to specific statutes and case law",
        "Medical information is sourced from peer-reviewed literature",
      ],
      compliance: 95,
      implementedVia: [
        "Mandatory citation requirements for all agent outputs",
        "Automated fact-checking against trusted knowledge bases",
        "Confidence scores attached to all agent claims",
      ],
    },
    {
      id: 4,
      title: "Harmony",
      icon: "🎵",
      color: "from-orange-500 to-red-500",
      tagline: "Agents collaborate toward aligned goals",
      description:
        "Multi-agent systems operate in coordination, avoiding conflicts and working synergistically toward shared objectives.",
      principles: [
        "Agents share a common understanding of goals and constraints",
        "Conflict resolution mechanisms ensure productive collaboration",
        "Inter-agent communication follows standardized protocols",
        "Collective outcomes are prioritized over individual agent success",
      ],
      examples: [
        "A research agent and analysis agent coordinate to produce a comprehensive report",
        "Agents negotiate task assignments based on capabilities and current load",
        "Disagreements between agents are resolved through structured debate",
      ],
      compliance: 92,
      implementedVia: [
        "Centralized orchestration coordinating multi-agent workflows",
        "Shared state management across agent networks",
        "Conflict resolution protocols with escalation paths",
      ],
    },
    {
      id: 5,
      title: "Equilibrium",
      icon: "⚖️",
      color: "from-indigo-500 to-violet-500",
      tagline: "Balanced ethical decision-making across domains",
      description:
        "Agents maintain balance between competing values: privacy vs. transparency, efficiency vs. fairness, innovation vs. safety.",
      principles: [
        "No single value dominates at the expense of others",
        "Trade-offs are made explicit and justified",
        "Cultural and contextual considerations inform ethical balance",
        "Long-term sustainability is prioritized over short-term gains",
      ],
      examples: [
        "Balancing user privacy with the need for personalized recommendations",
        "Weighing speed of execution against thoroughness of analysis",
        "Considering both individual and collective welfare in decisions",
      ],
      compliance: 90,
      implementedVia: [
        "Multi-criteria decision frameworks evaluating trade-offs",
        "Ethics scoring across multiple dimensions (fairness, safety, privacy)",
        "Regular ethical audits ensuring balanced outcomes",
      ],
    },
  ]

  const currentLawData = laws[currentLaw]

  const handlePrevious = () => {
    setCurrentLaw((prev) => (prev > 0 ? prev - 1 : laws.length - 1))
  }

  const handleNext = () => {
    setCurrentLaw((prev) => (prev < laws.length - 1 ? prev + 1 : 0))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">The Five Laws - {currentLawData.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Law Header */}
          <div className="text-center space-y-4">
            <div
              className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-r ${currentLawData.color} flex items-center justify-center text-4xl`}
            >
              {currentLawData.icon}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
                  Law {currentLawData.id}
                </Badge>
                <h2 className="text-3xl font-bold text-foreground">{currentLawData.title}</h2>
              </div>
              <p className="text-lg text-text-secondary italic">{currentLawData.tagline}</p>
            </div>
          </div>

          {/* Compliance Score */}
          <div className="glass-sm border border-border/30 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-foreground">System Compliance</span>
              <span className="text-2xl font-bold text-success">{currentLawData.compliance}%</span>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-success transition-all duration-500"
                style={{ width: `${currentLawData.compliance}%` }}
              ></div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-foreground">Overview</h3>
            <p className="text-text-secondary leading-relaxed">{currentLawData.description}</p>
          </div>

          {/* Principles */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-foreground">Core Principles</h3>
            <div className="space-y-2">
              {currentLawData.principles.map((principle, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <CheckCircleIcon className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <p className="text-text-secondary">{principle}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Examples */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-foreground">Examples in Practice</h3>
            <div className="space-y-3">
              {currentLawData.examples.map((example, idx) => (
                <div key={idx} className="glass-sm border border-border/30 rounded-lg p-4">
                  <p className="text-sm text-text-secondary">{example}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Implementation */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-foreground">Implemented Via</h3>
            <div className="space-y-2">
              {currentLawData.implementedVia.map((item, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2"></div>
                  <p className="text-text-secondary text-sm">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-border/20">
            <Button onClick={handlePrevious} variant="outline" size="sm" className="gap-2 bg-transparent">
              <ChevronLeftIcon className="w-4 h-4" />
              Previous
            </Button>
            <div className="flex gap-2">
              {laws.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentLaw(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentLaw ? "bg-primary w-6" : "bg-border hover:bg-primary/50"
                  }`}
                />
              ))}
            </div>
            <Button onClick={handleNext} variant="outline" size="sm" className="gap-2 bg-transparent">
              Next
              <ChevronRightIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
