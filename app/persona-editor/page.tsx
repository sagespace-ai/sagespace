"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Save, Trash2, ArrowLeft, Sparkles } from "@/components/icons"
import Link from "next/link"

interface AgentConfig {
  id?: string
  name: string
  role: string
  description: string
  avatar: string
  purpose: string
  tone: string
  capabilities: string
  system_prompt: string
  is_public: boolean
}

export default function PersonaEditorPage() {
  const [configs, setConfigs] = useState<AgentConfig[]>([])
  const [selectedConfig, setSelectedConfig] = useState<AgentConfig | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const emptyConfig: AgentConfig = {
    name: "",
    role: "",
    description: "",
    avatar: "🤖",
    purpose: "",
    tone: "professional and friendly",
    capabilities: "",
    system_prompt: "",
    is_public: false,
  }

  useEffect(() => {
    fetchConfigs()
  }, [])

  const fetchConfigs = async () => {
    try {
      const response = await fetch("/api/agent-configs")
      const data = await response.json()
      setConfigs(data.configs || [])
    } catch (error) {
      console.error("Error fetching configs:", error)
    }
  }

  const saveConfig = async () => {
    if (!selectedConfig) return

    try {
      const method = selectedConfig.id ? "PUT" : "POST"
      const url = selectedConfig.id ? `/api/agent-configs/${selectedConfig.id}` : "/api/agent-configs"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedConfig),
      })

      if (response.ok) {
        fetchConfigs()
        setIsEditing(false)
      }
    } catch (error) {
      console.error("Error saving config:", error)
    }
  }

  const deleteConfig = async (id: string) => {
    try {
      await fetch(`/api/agent-configs/${id}`, { method: "DELETE" })
      fetchConfigs()
      if (selectedConfig?.id === id) {
        setSelectedConfig(null)
        setIsEditing(false)
      }
    } catch (error) {
      console.error("Error deleting config:", error)
    }
  }

  const createNew = () => {
    setSelectedConfig(emptyConfig)
    setIsEditing(true)
  }

  const emojiOptions = ["🤖", "🧠", "⚡", "🔬", "🎨", "💼", "🛡️", "🔮", "🌟", "🚀", "💡", "🎯"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/playground">
              <Button variant="ghost">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                Persona Editor
              </h1>
              <p className="text-slate-400 mt-2">Create and customize your own AI agents</p>
            </div>
          </div>
          <Button onClick={createNew} className="bg-gradient-to-r from-cyan-500 to-purple-500">
            <Plus className="w-4 h-4 mr-2" />
            New Agent
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-lg font-semibold text-white">Your Agents</h2>
            {configs.map((config) => (
              <Card
                key={config.id}
                className={`p-4 cursor-pointer transition-all ${
                  selectedConfig?.id === config.id
                    ? "bg-purple-900/50 border-purple-500"
                    : "bg-slate-900/50 border-slate-700 hover:border-purple-400"
                }`}
                onClick={() => {
                  setSelectedConfig(config)
                  setIsEditing(false)
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-2xl">{config.avatar}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{config.name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {config.role}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-slate-400 line-clamp-2">{config.description}</p>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-2">
            {selectedConfig ? (
              <Card className="p-6 bg-slate-900/50 border-slate-700">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    {isEditing ? "Edit Agent" : selectedConfig.name || "New Agent"}
                  </h2>
                  <div className="flex gap-2">
                    {!isEditing && selectedConfig.id && (
                      <>
                        <Button variant="outline" onClick={() => setIsEditing(true)}>
                          Edit
                        </Button>
                        <Button variant="outline" onClick={() => deleteConfig(selectedConfig.id!)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    {isEditing && (
                      <>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                        <Button onClick={saveConfig} className="bg-gradient-to-r from-cyan-500 to-purple-500">
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Avatar</Label>
                    <div className="flex gap-2 mt-2">
                      {emojiOptions.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => isEditing && setSelectedConfig({ ...selectedConfig, avatar: emoji })}
                          disabled={!isEditing}
                          className={`text-2xl p-2 rounded border-2 transition-all ${
                            selectedConfig.avatar === emoji
                              ? "border-purple-500 bg-purple-900/30"
                              : "border-slate-700 hover:border-purple-400"
                          } ${!isEditing && "opacity-50 cursor-not-allowed"}`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={selectedConfig.name}
                        onChange={(e) => setSelectedConfig({ ...selectedConfig, name: e.target.value })}
                        disabled={!isEditing}
                        className="mt-2 bg-slate-800/50"
                        placeholder="Agent name"
                      />
                    </div>
                    <div>
                      <Label>Role</Label>
                      <Input
                        value={selectedConfig.role}
                        onChange={(e) => setSelectedConfig({ ...selectedConfig, role: e.target.value })}
                        disabled={!isEditing}
                        className="mt-2 bg-slate-800/50"
                        placeholder="e.g., Researcher, Ethics Advisor"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={selectedConfig.description}
                      onChange={(e) => setSelectedConfig({ ...selectedConfig, description: e.target.value })}
                      disabled={!isEditing}
                      className="mt-2 bg-slate-800/50"
                      placeholder="Brief description of the agent"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label>Purpose</Label>
                    <Textarea
                      value={selectedConfig.purpose}
                      onChange={(e) => setSelectedConfig({ ...selectedConfig, purpose: e.target.value })}
                      disabled={!isEditing}
                      className="mt-2 bg-slate-800/50"
                      placeholder="What is this agent's main purpose?"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label>Tone</Label>
                    <Input
                      value={selectedConfig.tone}
                      onChange={(e) => setSelectedConfig({ ...selectedConfig, tone: e.target.value })}
                      disabled={!isEditing}
                      className="mt-2 bg-slate-800/50"
                      placeholder="professional, friendly, technical, etc."
                    />
                  </div>

                  <div>
                    <Label>Capabilities</Label>
                    <Textarea
                      value={selectedConfig.capabilities}
                      onChange={(e) => setSelectedConfig({ ...selectedConfig, capabilities: e.target.value })}
                      disabled={!isEditing}
                      className="mt-2 bg-slate-800/50"
                      placeholder="What can this agent do?"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>System Prompt (Advanced)</Label>
                    <Textarea
                      value={selectedConfig.system_prompt}
                      onChange={(e) => setSelectedConfig({ ...selectedConfig, system_prompt: e.target.value })}
                      disabled={!isEditing}
                      className="mt-2 bg-slate-800/50 font-mono text-sm"
                      placeholder="Custom system prompt for fine-tuned control"
                      rows={4}
                    />
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-12 text-center bg-slate-900/50 border-slate-700">
                <Sparkles className="w-16 h-16 mx-auto mb-4 text-purple-400" />
                <h3 className="text-xl font-semibold text-slate-300 mb-2">Create Your First Agent</h3>
                <p className="text-slate-400 mb-6">
                  Design custom AI personas with unique capabilities and personalities
                </p>
                <Button onClick={createNew} className="bg-gradient-to-r from-cyan-500 to-purple-500">
                  <Plus className="w-4 h-4 mr-2" />
                  New Agent
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
