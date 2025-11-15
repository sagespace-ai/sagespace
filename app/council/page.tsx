"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Sparkles, ArrowLeft, Send, BookmarkPlus, Share2, RotateCw } from "@/components/icons"
import Link from "next/link"
import { SAGE_TEMPLATES } from "@/lib/sage-templates"

interface ChatMessage {
  id: string
  sageId: string
  sageName: string
  avatar: string
  color: string
  content: string
  timestamp: Date
  type: 'opinion' | 'agreement' | 'counter' | 'synthesis'
}

export default function CouncilPage() {
  const [stage, setStage] = useState<"input" | "deliberating" | "complete">("input")
  const [question, setQuestion] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [typingSages, setTypingSages] = useState<string[]>([])
  const [finalInsight, setFinalInsight] = useState("")
  const chatEndRef = useRef<HTMLDivElement>(null)

  const councilSages = [
    SAGE_TEMPLATES[0], // health-1: Wellness Coach
    SAGE_TEMPLATES[1], // health-2: Mental Health Guide
    SAGE_TEMPLATES[3], // health-4: Nutrition Specialist
    SAGE_TEMPLATES[4], // health-5: Sleep Optimizer
    SAGE_TEMPLATES[7], // health-8: Meditation Guide
  ].map((sage) => ({
    id: sage.id,
    name: sage.name,
    avatar: sage.avatar,
    domain: sage.domain,
    color: getColorForSage(sage.id),
  }))

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, typingSages])

  const handleStartDeliberation = async () => {
    if (!question.trim()) return

    setStage('deliberating')
    setMessages([])
    setTypingSages([])
    
    const deliberationSteps = [
      { sageIndex: 0, delay: 500, type: 'opinion' as const },
      { sageIndex: 1, delay: 2000, type: 'opinion' as const },
      { sageIndex: 2, delay: 3500, type: 'agreement' as const },
      { sageIndex: 3, delay: 5000, type: 'counter' as const },
      { sageIndex: 4, delay: 6500, type: 'opinion' as const },
    ]

    try {
      const response = await fetch('/api/council/deliberate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: question,
          agentIds: councilSages.map((s) => s.id),
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()
      
      if (data.response) {
        const perspectives = splitIntoPerspec tives(data.response, councilSages)
        
        for (let i = 0; i < perspectives.length; i++) {
          const step = deliberationSteps[i] || { sageIndex: i % councilSages.length, delay: 1000, type: 'opinion' }
          const sage = councilSages[step.sageIndex]
          
          // Show typing indicator
          await new Promise(resolve => setTimeout(resolve, step.delay))
          setTypingSages(prev => [...prev, sage.id])
          
          // Wait for "typing"
          await new Promise(resolve => setTimeout(resolve, 1500))
          
          // Add message
          setMessages(prev => [...prev, {
            id: `msg-${Date.now()}-${i}`,
            sageId: sage.id,
            sageName: sage.name,
            avatar: sage.avatar,
            color: sage.color,
            content: perspectives[i] || `I believe ${question} requires careful consideration...`,
            timestamp: new Date(),
            type: step.type,
          }])
          
          // Remove typing indicator
          setTypingSages(prev => prev.filter(id => id !== sage.id))
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000))
        setFinalInsight(data.response)
        setStage('complete')
      }
    } catch (error: any) {
      console.error('[v0] Council error:', error)
      setMessages([{
        id: 'error',
        sageId: 'system',
        sageName: 'System',
        avatar: '⚠️',
        color: '#ef4444',
        content: `Council deliberation encountered an error: ${error.message}`,
        timestamp: new Date(),
        type: 'opinion',
      }])
      setStage('complete')
    }
  }

  const handleNewQuestion = () => {
    setStage("input")
    setQuestion("")
    setMessages([])
    setTypingSages([])
    setFinalInsight("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/demo">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Hub
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <h1 className="text-2xl font-bold">Council</h1>
          </div>
          <Badge variant="outline" className="border-purple-400/50 text-purple-400">
            {councilSages.length} Sages
          </Badge>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-5xl">
        <AnimatePresence mode="wait">
          {/* Input Stage */}
          {stage === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold">Ask the Council</h2>
                <p className="text-lg text-slate-400">
                  Your question will spark a live deliberation among {councilSages.length} expert sages
                </p>
              </div>

              <Card className="p-6 bg-slate-900/50 border-slate-800">
                <Textarea
                  placeholder="What would you like the council to discuss?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="min-h-[150px] bg-slate-950/50 border-slate-700 resize-none"
                />
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex -space-x-2">
                    {councilSages.map((sage) => (
                      <div
                        key={sage.id}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xl border-2 border-slate-900"
                        style={{ backgroundColor: sage.color }}
                        title={sage.name}
                      >
                        {sage.avatar}
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={handleStartDeliberation}
                    disabled={!question.trim()}
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 to-pink-500"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Start Deliberation
                  </Button>
                </div>
              </Card>

              {/* Preview Grid */}
              <div className="grid grid-cols-5 gap-4">
                {councilSages.map((sage) => (
                  <div key={sage.id} className="text-center space-y-2">
                    <div
                      className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${sage.color}40` }}
                    >
                      {sage.avatar}
                    </div>
                    <p className="text-sm font-medium">{sage.name}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Deliberating Stage - Chat View */}
          {stage === "deliberating" && (
            <motion.div
              key="deliberating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Question Card */}
              <Card className="p-4 bg-slate-900/80 border-slate-800">
                <p className="text-slate-300 text-lg">{question}</p>
              </Card>

              {/* Chat Messages */}
              <div className="space-y-4 min-h-[500px] max-h-[600px] overflow-y-auto pr-2">
                <AnimatePresence>
                  {messages.map((msg, idx) => (
                    <ChatBubble key={msg.id} message={msg} index={idx} />
                  ))}
                </AnimatePresence>

                {/* Typing Indicators */}
                {typingSages.map((sageId) => {
                  const sage = councilSages.find(s => s.id === sageId)
                  return sage ? <TypingIndicator key={sageId} sage={sage} /> : null
                })}
                
                <div ref={chatEndRef} />
              </div>
            </motion.div>
          )}

          {/* Complete Stage - Final Insight */}
          {stage === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Chat History */}
              <Card className="p-6 bg-slate-900/50 border-slate-800 max-h-[400px] overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4 text-purple-400">Deliberation History</h3>
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div key={msg.id} className="flex gap-3 items-start">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                        style={{ backgroundColor: msg.color }}
                      >
                        {msg.avatar}
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">{msg.sageName}</p>
                        <p className="text-sm text-slate-300">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Final Synthesis */}
              <Card className="p-8 bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/50">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                  <h3 className="text-2xl font-bold">Council Synthesis</h3>
                </div>
                <p className="text-lg text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {finalInsight}
                </p>
                
                {/* Actions */}
                <div className="flex gap-3 mt-6">
                  <Button variant="outline" className="flex-1">
                    <BookmarkPlus className="w-4 h-4 mr-2" />
                    Save to Memory
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Insight
                  </Button>
                  <Button 
                    onClick={handleNewQuestion}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500"
                  >
                    <RotateCw className="w-4 h-4 mr-2" />
                    New Question
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

function ChatBubble({ message, index }: { message: ChatMessage; index: number }) {
  const isLeftAlign = index % 2 === 0
  
  return (
    <motion.div
      initial={{ opacity: 0, x: isLeftAlign ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`flex gap-3 ${isLeftAlign ? '' : 'flex-row-reverse'}`}
    >
      {/* Avatar */}
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0 shadow-lg"
        style={{ backgroundColor: message.color }}
      >
        {message.avatar}
      </div>
      
      {/* Message Bubble */}
      <div className={`max-w-[70%] ${isLeftAlign ? '' : 'text-right'}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-slate-300">{message.sageName}</span>
          <span className="text-xs text-slate-500">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div
          className={`p-4 rounded-2xl shadow-md ${
            isLeftAlign 
              ? 'rounded-tl-none bg-slate-800/80' 
              : 'rounded-tr-none bg-gradient-to-br from-purple-900/40 to-pink-900/40'
          }`}
        >
          <p className="text-slate-200 leading-relaxed">{message.content}</p>
        </div>
        
        {/* Type Badge */}
        {message.type !== 'opinion' && (
          <Badge 
            variant="outline" 
            className="mt-2 text-xs"
            style={{ borderColor: message.color, color: message.color }}
          >
            {message.type === 'agreement' && '✓ Agrees'}
            {message.type === 'counter' && '⚡ Counterpoint'}
            {message.type === 'synthesis' && '✨ Synthesis'}
          </Badge>
        )}
      </div>
    </motion.div>
  )
}

function TypingIndicator({ sage }: { sage: { id: string; name: string; avatar: string; color: string } }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex gap-3 items-center"
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-lg"
        style={{ backgroundColor: sage.color }}
      >
        {sage.avatar}
      </div>
      <div className="bg-slate-800/80 rounded-2xl rounded-tl-none px-5 py-3">
        <div className="flex gap-1">
          <motion.div
            className="w-2 h-2 rounded-full bg-slate-500"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="w-2 h-2 rounded-full bg-slate-500"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
          />
          <motion.div
            className="w-2 h-2 rounded-full bg-slate-500"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
          />
        </div>
      </div>
      <span className="text-sm text-slate-400">{sage.name} is thinking...</span>
    </motion.div>
  )
}

function getColorForSage(sageId: string): string {
  const colors = {
    'health-1': '#8b5cf6', // purple
    'health-2': '#ec4899', // pink
    'health-4': '#14b8a6', // teal
    'health-5': '#3b82f6', // blue
    'health-8': '#f59e0b', // amber
  }
  return colors[sageId as keyof typeof colors] || '#6366f1'
}

function splitIntoPerspectives(response: string, sages: any[]): string[] {
  // Try to split by sage mentions or fallback to equal chunks
  const lines = response.split('\n').filter(l => l.trim())
  const chunkSize = Math.ceil(lines.length / sages.length)
  
  const perspectives: string[] = []
  for (let i = 0; i < sages.length; i++) {
    const start = i * chunkSize
    const end = Math.min(start + chunkSize, lines.length)
    const chunk = lines.slice(start, end).join(' ')
    if (chunk) perspectives.push(chunk)
  }
  
  return perspectives.length > 0 ? perspectives : [response]
}
