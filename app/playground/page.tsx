"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { EyeIcon, ScaleIcon, BrainIcon, HomeIcon, SendIcon } from "@/components/icons"

export default function PlaygroundPage() {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          agentId: "demo-agent",
        }),
      })

      const data = await response.json()
      setMessages((prev) => [...prev, { role: "assistant", content: data.message }])
    } catch (error) {
      console.error("Chat error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-slate-900 to-black">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">AI Playground</h1>
          <div className="flex items-center gap-2">
            <Link href="/observatory">
              <Button variant="ghost" size="sm" className="text-slate-300">
                <EyeIcon className="w-4 h-4 mr-1" />
                Observatory
              </Button>
            </Link>
            <Link href="/council">
              <Button variant="ghost" size="sm" className="text-slate-300">
                <ScaleIcon className="w-4 h-4 mr-1" />
                Council
              </Button>
            </Link>
            <Link href="/memory">
              <Button variant="ghost" size="sm" className="text-slate-300">
                <BrainIcon className="w-4 h-4 mr-1" />
                Memory
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="ghost" size="sm" className="text-slate-300">
                <HomeIcon className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Chat */}
        <Card className="bg-slate-900/50 border-purple-500/20 backdrop-blur-sm p-6">
          <div className="space-y-4 mb-4 h-[600px] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-slate-400">
                Start a conversation with an AI agent
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] p-4 rounded-lg ${
                      msg.role === "user" ? "bg-cyan-500/20 text-white" : "bg-purple-500/20 text-white"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-purple-500/20 text-white p-4 rounded-lg">Thinking...</div>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask anything..."
              className="bg-slate-800 border-slate-700 text-white"
              disabled={loading}
            />
            <Button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="bg-gradient-to-r from-cyan-500 to-purple-500"
            >
              <SendIcon className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
