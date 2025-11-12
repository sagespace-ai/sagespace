"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle, Circle, Database, Key, Rocket } from "@/components/icons"

export default function SetupPage() {
  const [step, setStep] = useState(1)
  const [dbInitialized, setDbInitialized] = useState(false)
  const [apiKeyAdded, setApiKeyAdded] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Welcome to SageSpace
          </h1>
          <p className="text-slate-300 text-lg">Let's get your AI agent universe up and running</p>
        </div>

        <div className="space-y-6">
          {/* Step 1: Database */}
          <Card className="bg-slate-900/50 border-slate-700 p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {dbInitialized ? (
                  <CheckCircle className="w-8 h-8 text-green-400" />
                ) : (
                  <Circle className="w-8 h-8 text-slate-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-xl font-semibold">Step 1: Initialize Database</h3>
                </div>
                <p className="text-slate-300 mb-4">
                  Run the database initialization script to create all tables and demo data.
                </p>
                <div className="bg-slate-800 p-4 rounded-lg mb-4">
                  <ol className="list-decimal list-inside space-y-2 text-sm text-slate-300">
                    <li>Open the Scripts panel (bottom left corner of v0)</li>
                    <li>
                      Find the script: <code className="text-cyan-400">000-initialize-database.sql</code>
                    </li>
                    <li>Click "Run" and wait for success message</li>
                  </ol>
                </div>
                <Button
                  onClick={() => setDbInitialized(true)}
                  variant={dbInitialized ? "outline" : "default"}
                  disabled={dbInitialized}
                >
                  {dbInitialized ? "Database Initialized ✓" : "Mark as Complete"}
                </Button>
              </div>
            </div>
          </Card>

          {/* Step 2: API Key */}
          <Card className="bg-slate-900/50 border-slate-700 p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {apiKeyAdded ? (
                  <CheckCircle className="w-8 h-8 text-green-400" />
                ) : (
                  <Circle className="w-8 h-8 text-slate-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Key className="w-5 h-5 text-purple-400" />
                  <h3 className="text-xl font-semibold">Step 2: Add AI Provider</h3>
                </div>
                <p className="text-slate-300 mb-4">Choose at least one AI provider to power your agents.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-slate-800 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-green-400">OpenAI (Recommended)</h4>
                    <p className="text-sm text-slate-300 mb-2">Industry standard, reliable, great for testing.</p>
                    <a
                      href="https://platform.openai.com/api-keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-cyan-400 hover:underline"
                    >
                      Get API Key →
                    </a>
                  </div>

                  <div className="bg-slate-800 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-orange-400">Groq (Free & Fast)</h4>
                    <p className="text-sm text-slate-300 mb-2">Free tier available, lightning fast inference.</p>
                    <a
                      href="https://console.groq.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-cyan-400 hover:underline"
                    >
                      Get API Key →
                    </a>
                  </div>

                  <div className="bg-slate-800 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-purple-400">Anthropic Claude</h4>
                    <p className="text-sm text-slate-300 mb-2">Advanced reasoning, great for complex tasks.</p>
                    <a
                      href="https://console.anthropic.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-cyan-400 hover:underline"
                    >
                      Get API Key →
                    </a>
                  </div>

                  <div className="bg-slate-800 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-blue-400">xAI Grok</h4>
                    <p className="text-sm text-slate-300 mb-2">Real-time data access, cutting edge.</p>
                    <a
                      href="https://console.x.ai/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-cyan-400 hover:underline"
                    >
                      Get API Key →
                    </a>
                  </div>
                </div>

                <div className="bg-yellow-900/20 border border-yellow-700 p-3 rounded-lg mb-4">
                  <p className="text-sm text-yellow-300">
                    <strong>How to add:</strong> Go to the in-chat sidebar → Vars → Add new variable
                    <br />
                    <code className="text-xs">OPENAI_API_KEY</code> or{" "}
                    <code className="text-xs">ANTHROPIC_API_KEY</code> or <code className="text-xs">GROQ_API_KEY</code>
                  </p>
                </div>

                <Button
                  onClick={() => setApiKeyAdded(true)}
                  variant={apiKeyAdded ? "outline" : "default"}
                  disabled={apiKeyAdded}
                >
                  {apiKeyAdded ? "API Key Added ✓" : "Mark as Complete"}
                </Button>
              </div>
            </div>
          </Card>

          {/* Step 3: Launch */}
          <Card className="bg-slate-900/50 border-slate-700 p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Rocket className="w-8 h-8 text-cyan-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">Step 3: Launch Your Universe</h3>
                <p className="text-slate-300 mb-4">You're all set! Explore these features:</p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <a
                    href="/playground"
                    className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 p-4 rounded-lg hover:border-cyan-400 transition-colors"
                  >
                    <div className="text-2xl mb-2">🎮</div>
                    <div className="font-semibold">Playground</div>
                    <div className="text-xs text-slate-400">Chat with AI</div>
                  </a>

                  <a
                    href="/council"
                    className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 p-4 rounded-lg hover:border-purple-400 transition-colors"
                  >
                    <div className="text-2xl mb-2">⚖️</div>
                    <div className="font-semibold">Council</div>
                    <div className="text-xs text-slate-400">Agent voting</div>
                  </a>

                  <a
                    href="/observatory"
                    className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 p-4 rounded-lg hover:border-blue-400 transition-colors"
                  >
                    <div className="text-2xl mb-2">🔭</div>
                    <div className="font-semibold">Observatory</div>
                    <div className="text-xs text-slate-400">Monitor agents</div>
                  </a>

                  <a
                    href="/memory"
                    className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 p-4 rounded-lg hover:border-green-400 transition-colors"
                  >
                    <div className="text-2xl mb-2">🧠</div>
                    <div className="font-semibold">Memory</div>
                    <div className="text-xs text-slate-400">Agent learning</div>
                  </a>

                  <a
                    href="/multiverse"
                    className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 p-4 rounded-lg hover:border-orange-400 transition-colors"
                  >
                    <div className="text-2xl mb-2">🌌</div>
                    <div className="font-semibold">Multiverse</div>
                    <div className="text-xs text-slate-400">Conversations</div>
                  </a>

                  <a
                    href="/persona-editor"
                    className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 p-4 rounded-lg hover:border-yellow-400 transition-colors"
                  >
                    <div className="text-2xl mb-2">✨</div>
                    <div className="font-semibold">Persona</div>
                    <div className="text-xs text-slate-400">Create agents</div>
                  </a>
                </div>

                <div className="mt-6">
                  <Button
                    onClick={() => (window.location.href = "/playground")}
                    disabled={!dbInitialized || !apiKeyAdded}
                    className="w-full"
                    size="lg"
                  >
                    {dbInitialized && apiKeyAdded ? "Launch Playground 🚀" : "Complete setup steps first"}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-8 text-center text-slate-400 text-sm">
          <p>
            Need help? Check out{" "}
            <a href="/docs" className="text-cyan-400 hover:underline">
              the documentation
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
