"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface Principle {
  id: string
  label: string
  icon: string
  color: string
  description: string
  details: string[]
  impact: string
}

const PRINCIPLES: Principle[] = [
  {
    id: "human-primacy",
    label: "Human Primacy",
    icon: "👤",
    color: "from-primary",
    description: "Humans retain ultimate authority and oversight over all agent operations.",
    details: [
      "All significant agent decisions require human approval",
      "Humans can override, pause, or terminate agent processes",
      "Audit trails track all human-agent interactions",
      "Transparent reporting of agent actions to humans",
    ],
    impact: "Ensures human control remains central to the architecture",
  },
  {
    id: "autonomy",
    label: "Autonomy",
    icon: "🧠",
    color: "from-accent",
    description: "Agents operate with genuine independence within ethical and operational boundaries.",
    details: [
      "Agents can make decisions without constant human intervention",
      "Self-directed learning and adaptation within constraints",
      "Freedom to explore solutions creatively",
      "Ability to communicate directly with other agents",
    ],
    impact: "Enables agents to be genuinely useful and responsive",
  },
  {
    id: "transparency",
    label: "Transparency",
    icon: "🔍",
    color: "from-accent-secondary",
    description: "All decisions, actions, and reasoning processes are verifiable and explainable.",
    details: [
      "Agents must explain their reasoning for decisions",
      "All interactions are logged and auditable",
      "Clear documentation of agent capabilities and limitations",
      "Explainable AI principles guide all agent operations",
    ],
    impact: "Builds trust through complete visibility and accountability",
  },
  {
    id: "harmony",
    label: "Harmony",
    icon: "🤝",
    color: "from-primary",
    description: "Agents work together cohesively, creating synergistic relationships.",
    details: [
      "Agents collaborate on complex tasks",
      "Conflict resolution mechanisms for disagreements",
      "Shared knowledge and learning across agents",
      "Coordinated problem-solving approaches",
    ],
    impact: "Multiplies the value of individual agents through cooperation",
  },
  {
    id: "equilibrium",
    label: "Equilibrium",
    icon: "⚖️",
    color: "from-accent",
    description: "Balance maintained between agent autonomy and human control.",
    details: [
      "Freedom tempered by responsibility",
      "Innovation balanced with safety",
      "Efficiency balanced with ethical considerations",
      "Growth balanced with stability",
    ],
    impact: "Prevents either extreme dominance of control or autonomy",
  },
]

interface PrinciplesModalProps {
  onPrincipleSelect?: (principleId: string) => void
}

export function PrinciplesModal({ onPrincipleSelect }: PrinciplesModalProps) {
  const [selectedPrinciple, setSelectedPrinciple] = useState<Principle | null>(null)

  const handleSelect = (principle: Principle) => {
    setSelectedPrinciple(principle)
    onPrincipleSelect?.(principle.id)
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-8">
        {PRINCIPLES.map((principle) => (
          <button
            key={principle.id}
            onClick={() => handleSelect(principle)}
            className="group glass px-4 py-3 rounded-xl border border-border/30 hover:border-primary/50 transition-subtle hover:cosmic-glow cursor-pointer text-left"
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <span className="text-2xl group-hover:scale-110 transition-transform">{principle.icon}</span>
              <span className="text-xs font-medium text-text-secondary group-hover:text-foreground transition-colors">
                {principle.label}
              </span>
            </div>
          </button>
        ))}
      </div>

      <Dialog open={!!selectedPrinciple} onOpenChange={(open) => !open && setSelectedPrinciple(null)}>
        <DialogContent className="max-w-2xl glass border-border/30">
          <DialogHeader>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-5xl">{selectedPrinciple?.icon}</span>
              <div>
                <DialogTitle className="text-3xl">{selectedPrinciple?.label}</DialogTitle>
                <DialogDescription className="text-base mt-2">{selectedPrinciple?.description}</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {selectedPrinciple && (
            <div className="space-y-6 pt-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground text-lg">Key Mechanisms</h4>
                <ul className="space-y-2">
                  {selectedPrinciple.details.map((detail, idx) => (
                    <li key={idx} className="flex gap-3 items-start">
                      <span className="text-primary font-bold">•</span>
                      <span className="text-text-secondary">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 glass-sm border border-border/30 rounded-xl bg-primary/5">
                <p className="text-sm text-text-secondary">
                  <span className="font-semibold text-foreground">Impact: </span>
                  {selectedPrinciple.impact}
                </p>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Badge className="bg-primary/20 text-primary border border-primary/30 rounded-full">Philosophy</Badge>
                <Badge className="bg-accent/20 text-accent border border-accent/30 rounded-full">Governance</Badge>
                <Badge className="bg-success/20 text-success border border-success/30 rounded-full">Ethical</Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
