"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { HomeIcon } from "@/components/icons"
import { SAGE_TEMPLATES, getAllDomains, getSagesByDomain } from "@/lib/sage-templates"

export default function MarketplacePage() {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null)
  const domains = getAllDomains()

  const displaySages = selectedDomain ? getSagesByDomain(selectedDomain) : SAGE_TEMPLATES

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-slate-900 to-black relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>
      {/* </CHANGE> */}

      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              Add a Sage to your Universe
            </h1>
            <p className="text-slate-400 mt-1">Your Agents Have Logic. Give Them Wisdom</p>
          </div>
          <Link href="/demo">
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
              <HomeIcon className="w-5 h-5" />
            </Button>
          </Link>
        </div>
        {/* </CHANGE> */}

        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            onClick={() => setSelectedDomain(null)}
            variant={selectedDomain === null ? "default" : "outline"}
            size="sm"
            className={
              selectedDomain === null
                ? "bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                : "border-purple-500/30 text-slate-300 hover:border-purple-500/50"
            }
          >
            All ({SAGE_TEMPLATES.length})
          </Button>
          {domains.map((domain) => (
            <Button
              key={domain}
              onClick={() => setSelectedDomain(domain)}
              variant={selectedDomain === domain ? "default" : "outline"}
              size="sm"
              className={
                selectedDomain === domain
                  ? "bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                  : "border-purple-500/30 text-slate-300 hover:border-purple-500/50"
              }
            >
              {domain} ({getSagesByDomain(domain).length})
            </Button>
          ))}
        </div>
        {/* </CHANGE> */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displaySages.map((sage) => (
            <Card
              key={sage.id}
              className="bg-slate-900/50 border-purple-500/20 backdrop-blur-sm p-4 hover:border-purple-500/50 transition-all hover:scale-105 cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                <div className="text-4xl">{sage.avatar}</div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold group-hover:text-purple-400 transition-colors">
                    {sage.name}
                  </h3>
                  <p className="text-xs text-cyan-400 mb-1">{sage.role}</p>
                  <p className="text-sm text-slate-400 mb-2">{sage.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {sage.capabilities.map((cap, idx) => (
                      <span key={idx} className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full">
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        {/* </CHANGE> */}
      </div>
    </div>
  )
}
