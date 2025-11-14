"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Send, Sparkles } from '@/components/icons'

export default function AgentChat({ agentId }: { agentId: string }) {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  
  const sendMessage = async () => {
    if (!input.trim()) return
    
    const userMessage = { role: 'user', content: input }
    setMessages([...messages, userMessage])
    setInput('')
    setLoading(true)
    
    try {
      const response = await fetch('/api/chat/agent-runtime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId,
          message: input,
          conversationHistory: messages,
          sessionId: `session-${Date.now()}`,
        }),
      })
      
      if (response.ok) {
        const data = await response.json()
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
        
        console.log('[v0] Agent execution metadata:', data.metadata)
        console.log('[v0] Used integrations:', data.usedIntegrations)
      } else {
        alert('Failed to get response from agent')
      }
    } catch (error) {
      console.error('[v0] Agent chat error:', error)
      alert('Error communicating with agent')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                msg.role === 'user'
                  ? 'bg-cyan-500/20 border border-cyan-500/30'
                  : 'bg-slate-800 border border-slate-700'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
          </div>
        )}
      </div>
      
      <div className="border-t border-slate-700 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Chat with your agent..."
            className="flex-1 px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
            disabled={loading}
          />
          <Button onClick={sendMessage} disabled={loading || !input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
