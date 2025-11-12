"use client"

import { useState } from "react"
import { sageTemplates, domainInfo, type SageDomain } from "@/lib/sage-templates"
import { AppHeader } from "@/components/app-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SearchIcon as Search, SparklesIcon as Sparkles } from "@/components/icons"
import Link from "next/link"

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDomain, setSelectedDomain] = useState<SageDomain | "all">("all")
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  const filteredTemplates = sageTemplates.filter((template) => {
    const matchesSearch =
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDomain = selectedDomain === "all" || template.domain === selectedDomain

    return matchesSearch && matchesDomain
  })

  const templatesByDomain = Object.keys(domainInfo).reduce(
    (acc, domain) => {
      acc[domain as SageDomain] = sageTemplates.filter((t) => t.domain === domain)
      return acc
    },
    {} as Record<SageDomain, typeof sageTemplates>,
  )

  return (
    <div className="min-h-screen bg-background cosmic-gradient">
      <AppHeader />

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-border/30 mb-4">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-foreground">50 Sage Templates</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-balance">
            <span className="bg-gradient-to-r from-accent via-primary to-accent-secondary bg-clip-text text-transparent">
              Sage Marketplace
            </span>
          </h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Pre-built intelligent agents for every domain. Choose a template, customize it, and bring your sage to life
            in minutes.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <Input
              placeholder="Search templates by name, role, or capability..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 glass border-border/30 focus:border-primary/50"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value as SageDomain | "all")}
              className="px-4 py-2 rounded-lg glass border border-border/30 focus:border-primary/50 text-foreground bg-background"
            >
              <option value="all">All Domains</option>
              {Object.entries(domainInfo).map(([key, info]) => (
                <option key={key} value={key}>
                  {info.icon} {info.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Domain Overview Cards */}
        {selectedDomain === "all" && !searchQuery && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {Object.entries(domainInfo).map(([key, info]) => (
              <button
                key={key}
                onClick={() => setSelectedDomain(key as SageDomain)}
                className="glass-sm border border-border/30 rounded-xl p-6 hover:border-primary/50 transition-subtle hover:scale-105 text-left group"
              >
                <div className="text-4xl mb-3">{info.icon}</div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{info.name}</h3>
                <p className="text-sm text-text-secondary mb-3">{info.description}</p>
                <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
                  {templatesByDomain[key as SageDomain]?.length || 0} templates
                </Badge>
              </button>
            ))}
          </div>
        )}

        {/* Template Grid */}
        <div className="space-y-8">
          {selectedDomain === "all" && !searchQuery ? (
            Object.entries(domainInfo).map(([domain, info]) => (
              <div key={domain} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{info.icon}</div>
                    <div>
                      <h2 className="text-2xl font-bold">{info.name}</h2>
                      <p className="text-sm text-text-secondary">{info.description}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedDomain(domain as SageDomain)}
                    className="text-primary hover:text-primary/80"
                  >
                    View All →
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templatesByDomain[domain as SageDomain]?.slice(0, 3).map((template) => (
                    <TemplateCard key={template.id} template={template} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          )}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-20 text-text-secondary">
            <p className="text-lg">No templates found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}

function TemplateCard({ template }: { template: (typeof sageTemplates)[0] }) {
  const domainColor = domainInfo[template.domain].color

  return (
    <Link href={`/marketplace/${template.id}`}>
      <div className="group glass-sm border border-border/30 rounded-xl overflow-hidden hover:border-primary/50 transition-subtle hover:cosmic-glow cursor-pointer h-full">
        <div className={`h-2 bg-gradient-to-r ${domainColor}`} />
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="text-3xl">{template.icon}</div>
            <Badge variant="outline" className="bg-accent/20 text-accent border-accent/30 text-xs capitalize">
              {template.modality}
            </Badge>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{template.title}</h3>
            <p className="text-sm text-text-secondary mb-2">{template.description}</p>
            <p className="text-xs text-accent font-medium">{template.role}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {template.capabilities.slice(0, 3).map((cap) => (
              <Badge key={cap} variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                {cap.replace(/-/g, " ")}
              </Badge>
            ))}
            {template.capabilities.length > 3 && (
              <Badge variant="outline" className="text-xs bg-muted text-text-muted border-border/30">
                +{template.capabilities.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
