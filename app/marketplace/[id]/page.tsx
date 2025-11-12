"use client"

import { useState } from "react"
import { useParams, useRouter } from 'next/navigation'
import { sageTemplates, domainInfo } from "@/lib/sage-templates"
import { AppHeader } from "@/components/app-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Sparkles, Check } from 'lucide-react'
import Link from "next/link"

export default function TemplateDetailPage() {
  const params = useParams()
  const router = useRouter()
  const template = sageTemplates.find((t) => t.id === params.id)
  const [name, setName] = useState(template?.title || "")
  const [customDescription, setCustomDescription] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  if (!template) {
    return (
      <div className="min-h-screen bg-background cosmic-gradient flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-text-secondary">Template not found</p>
          <Link href="/marketplace">
            <Button className="mt-4">Back to Marketplace</Button>
          </Link>
        </div>
      </div>
    )
  }

  const domain = domainInfo[template.domain]

  const handleCreateSage = async () => {
    setIsCreating(true)
    try {
      const response = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          role: template.role,
          purpose: customDescription || template.description,
          status: "idle",
          harmonyScore: 75,
          ethicsAlignment: 85,
        }),
      })

      if (response.ok) {
        router.push("/demo")
      }
    } catch (error) {
      console.error("Error creating sage:", error)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-background cosmic-gradient">
      <AppHeader />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link href="/marketplace">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Marketplace
          </Button>
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Template Details */}
          <div className="space-y-6">
            <div className={`h-2 w-full rounded-full bg-gradient-to-r ${domain.color}`} />

            <div className="space-y-4">
              <div className="text-6xl">{template.icon}</div>
              <div>
                <Badge className="mb-2 bg-accent/20 text-accent border-accent/30">{domain.name}</Badge>
                <h1 className="text-4xl font-bold mb-2">{template.title}</h1>
                <p className="text-xl text-text-secondary">{template.description}</p>
              </div>
            </div>

            <div className="glass-sm border border-border/30 rounded-xl p-6 space-y-4">
              <div>
                <h3 className="font-semibold mb-2 text-foreground">Role</h3>
                <p className="text-text-secondary">{template.role}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-foreground">Tone</h3>
                <Badge className="capitalize bg-primary/20 text-primary border-primary/30">{template.tone}</Badge>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-foreground">Modality</h3>
                <Badge className="capitalize bg-accent/20 text-accent border-accent/30">{template.modality}</Badge>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-foreground">Example Output</h3>
                <p className="text-sm text-text-secondary italic">{template.exampleOutput}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-3 text-foreground">Capabilities</h3>
                <div className="flex flex-wrap gap-2">
                  {template.capabilities.map((cap) => (
                    <Badge key={cap} className="bg-primary/10 text-primary border-primary/20">
                      {cap.replace(/-/g, " ")}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 text-foreground">Ethical Guardrails</h3>
                <div className="space-y-2">
                  {template.ethicalGuardrails.map((guardrail) => (
                    <div key={guardrail} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-text-secondary">{guardrail.replace(/-/g, " ")}</span>
                    </div>
                  ))}
                </div>
              </div>

              {template.sourceAttachments.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3 text-foreground">Integrations</h3>
                  <div className="flex flex-wrap gap-2">
                    {template.sourceAttachments.map((source) => (
                      <Badge key={source} variant="outline" className="bg-accent/10 text-accent border-accent/30">
                        {source}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Customization Form */}
          <div className="space-y-6">
            <div className="glass-sm border border-border/30 rounded-xl p-6 space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-accent" />
                <h2 className="text-2xl font-bold">Customize Your Sage</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Sage Name</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Give your sage a unique name"
                    className="glass border-border/30 focus:border-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    Custom Purpose <span className="text-text-muted">(optional)</span>
                  </label>
                  <Textarea
                    value={customDescription}
                    onChange={(e) => setCustomDescription(e.target.value)}
                    placeholder="Customize the sage's purpose or use the default..."
                    className="glass border-border/30 focus:border-primary/50 min-h-24"
                  />
                  <p className="text-xs text-text-muted mt-1">Default: {template.description}</p>
                </div>

                <div className="space-y-2 pt-4">
                  <h3 className="text-sm font-medium text-foreground">Included Features:</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <Check className="w-4 h-4 text-success" />
                      <span>{template.tone} tone personality</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <Check className="w-4 h-4 text-success" />
                      <span>{template.modality} communication</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <Check className="w-4 h-4 text-success" />
                      <span>{template.capabilities.length} core capabilities</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <Check className="w-4 h-4 text-success" />
                      <span>{template.ethicalGuardrails.length} ethical guardrails</span>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleCreateSage}
                disabled={!name || isCreating}
                className="w-full bg-gradient-to-r from-primary to-accent text-white font-semibold"
              >
                {isCreating ? "Creating Sage..." : "Create Sage from Template"}
              </Button>
            </div>

            <div className="glass-sm border border-border/30 rounded-xl p-6 space-y-3">
              <h3 className="font-semibold text-foreground">What happens next?</h3>
              <div className="space-y-2 text-sm text-text-secondary">
                <p>✨ Your sage will be born into your universe</p>
                <p>🎯 It will have all the template capabilities pre-configured</p>
                <p>⚖️ Ethical guardrails will be automatically enforced</p>
                <p>💬 You can start interacting immediately</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
