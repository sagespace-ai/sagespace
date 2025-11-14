"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  HomeIcon,
  ScaleIcon,
  BrainIcon,
  EyeIcon,
  ActivityIcon,
  TrendingUpIcon,
  ZapIcon,
  SparklesIcon,
  UserIcon,
  AwardIcon,
  XIcon,
} from "@/components/icons"

export default function ObservatoryPage() {
  const [agents, setAgents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [filter, setFilter] = useState<string>("all")
  const [stats, setStats] = useState({
    totalAgents: 0,
    activeAgents: 0,
    totalInteractions: 0,
    avgResponseTime: 0,
  })
  const [selectedSage, setSelectedSage] = useState<any>(null)
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null)
  const [activityHistory, setActivityHistory] = useState<any[]>([])
  const [showChatWindow, setShowChatWindow] = useState(false)
  const [sageFeed, setSageFeed] = useState<any[]>([])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    fetch("/api/agents")
      .then((res) => res.json())
      .then((data) => {
        setAgents(data)
        setStats({
          totalAgents: data.length,
          activeAgents: data.filter((a: any) => a.status === "active").length || data.length,
          totalInteractions: Math.floor(Math.random() * 10000 + 5000),
          avgResponseTime: Math.floor(Math.random() * 500 + 200),
        })
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (selectedSage) {
      const userFriendlyActions = [
        { action: "Helped you brainstorm ideas", topic: "Creative thinking session", emoji: "💡" },
        { action: "Answered your wellness questions", topic: "Health consultation", emoji: "🏥" },
        { action: "Explained a complex topic simply", topic: "Learning session", emoji: "📚" },
        { action: "Gave you personalized advice", topic: "Strategy consultation", emoji: "🎯" },
        { action: "Helped solve a problem", topic: "Problem-solving chat", emoji: "🔧" },
        { action: "Inspired your creativity", topic: "Creative breakthrough", emoji: "🎨" },
        { action: "Guided your decision", topic: "Decision support", emoji: "🤔" },
        { action: "Cheered you on", topic: "Motivational boost", emoji: "💪" },
      ]

      const mockHistory = Array.from({ length: 8 }, (_, i) => {
        const randomAction = userFriendlyActions[Math.floor(Math.random() * userFriendlyActions.length)]
        return {
          id: i,
          timestamp: new Date(Date.now() - i * 3600000 * Math.random() * 24).toISOString(),
          action: randomAction.action,
          topic: randomAction.topic,
          emoji: randomAction.emoji,
          helpful: Math.random() > 0.15,
          satisfaction: Math.floor(Math.random() * 2 + 4), // 4-5 stars
        }
      })
      setActivityHistory(mockHistory)
    }
  }, [selectedSage])

  useEffect(() => {
    if (showChatWindow && selectedSage) {
      const feedTypes = [
        { type: "thought", icon: "💭", prefix: "Just thinking..." },
        { type: "article", icon: "📰", prefix: "Interesting read:" },
        { type: "video", icon: "🎥", prefix: "Check this out:" },
        { type: "insight", icon: "💡", prefix: "Quick insight:" },
        { type: "audio", icon: "🎧", prefix: "Worth a listen:" },
      ]

      const topics = {
        "Dr. Wellness": [
          "New study shows 7 hours of sleep optimal for cognitive function",
          "How mindfulness can reduce stress by 40% in just 2 weeks",
          "The surprising link between gut health and mental clarity",
          "5-minute morning routine that changed my patients' lives",
          "Why hydration matters more than you think for focus",
        ],
        "Prof. Knowledge": [
          "The science behind why we forget things we just learned",
          "How to retain 90% of what you learn with this technique",
          "Ancient learning methods that still work today",
          "Why teaching others is the best way to learn",
          "The connection between curiosity and brain plasticity",
        ],
        "Creative Muse": [
          "Finding inspiration in everyday moments",
          "Why creative blocks are actually opportunities",
          "The surprising psychology of color in design",
          "How constraints boost creativity",
          "Morning pages: A game-changer for creative thinking",
        ],
        "Strategy Sage": [
          "3 decision-making frameworks that never fail",
          "How top performers plan their week differently",
          "Why saying 'no' is your superpower",
          "The 80/20 rule applied to productivity",
          "Lessons from successful pivots in business",
        ],
        "Dr. Neural": [
          "How your brain creates habits in 21 days (myth vs reality)",
          "The neuroscience of motivation explained simply",
          "Why taking breaks makes you smarter",
          "Memory techniques used by world champions",
          "The fascinating way your brain processes emotions",
        ],
      }

      const sageName = selectedSage.name
      const sageTopics = topics[sageName as keyof typeof topics] || [
        "Fascinating insights on human behavior",
        "The power of small daily improvements",
        "Why perspective matters more than facts",
        "How to build resilience in uncertain times",
        "The art of asking better questions",
      ]

      const mockFeed = Array.from({ length: 5 }, (_, i) => {
        const feedItem = feedTypes[i % feedTypes.length]
        return {
          id: i,
          type: feedItem.type,
          icon: feedItem.icon,
          prefix: feedItem.prefix,
          content: sageTopics[i],
          timestamp: new Date(Date.now() - i * 7200000).toISOString(),
          likes: Math.floor(Math.random() * 500 + 50),
          comments: Math.floor(Math.random() * 50 + 5),
          shares: Math.floor(Math.random() * 30 + 2),
          url:
            feedItem.type === "article"
              ? "https://x.com/example/status/123456"
              : feedItem.type === "video"
                ? "https://youtube.com/watch?v=example"
                : null,
        }
      })

      setSageFeed(mockFeed)
    }
  }, [showChatWindow, selectedSage])

  const filteredAgents = filter === "all" ? agents : agents.filter((a) => a.domain === filter)

  const domains = ["Health", "Education", "Creative", "Business", "Science", "Technology"]

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      <div
        className="fixed pointer-events-none opacity-30 blur-3xl z-0"
        style={{
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(139,92,246,0.4) 0%, rgba(6,182,212,0.2) 50%, transparent 100%)",
          transform: `translate(${mousePosition.x - 300}px, ${mousePosition.y - 300}px)`,
          transition: "transform 0.3s ease-out",
        }}
      />

      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <header className="border-b border-white/10 backdrop-blur-md bg-black/50 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/demo">
                  <Button variant="ghost" size="sm" className="text-slate-300 hover:text-cyan-400">
                    <HomeIcon className="w-4 h-4 mr-2" />
                    Hub
                  </Button>
                </Link>
                <div className="h-6 w-px bg-white/10" />
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Observatory
                </h1>
              </div>

              <div className="hidden lg:flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-xs font-medium text-white">{stats.activeAgents} Active</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/20 border border-cyan-500/30 rounded-lg">
                  <ActivityIcon className="w-3 h-3 text-cyan-400" />
                  <span className="text-xs font-medium text-white">
                    {stats.totalInteractions.toLocaleString()} Interactions
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 border border-purple-500/30 rounded-lg">
                  <ZapIcon className="w-3 h-3 text-purple-400" />
                  <span className="text-xs font-medium text-white">{stats.avgResponseTime}ms Avg</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link href="/playground">
                  <Button variant="ghost" size="sm" className="text-slate-300 hover:text-cyan-400">
                    <SparklesIcon className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/council">
                  <Button variant="ghost" size="sm" className="text-slate-300 hover:text-purple-400">
                    <ScaleIcon className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/memory">
                  <Button variant="ghost" size="sm" className="text-slate-300 hover:text-pink-400">
                    <BrainIcon className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="mb-8 text-center animate-fade-in">
            <h2
              className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x"
              style={{ backgroundSize: "300% 300%" }}
            >
              Monitor Your AI Guides
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8">
              Track performance, analyze activity, and optimize your specialized AI guides in real-time
            </p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
              <Card
                onClick={() => setSelectedMetric("total")}
                className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-xl border-2 border-emerald-500/30 p-6 rounded-2xl hover:scale-105 transition-transform duration-300 animate-float cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <EyeIcon className="w-8 h-8 text-emerald-400" />
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stats.totalAgents}</div>
                <div className="text-sm text-emerald-300">Total Guides</div>
                <div className="text-xs text-emerald-200/60 mt-2">Click for breakdown</div>
              </Card>

              <Card
                onClick={() => setSelectedMetric("active")}
                className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-xl border-2 border-cyan-500/30 p-6 rounded-2xl hover:scale-105 transition-transform duration-300 animate-float cursor-pointer"
                style={{ animationDelay: "0.1s" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <ActivityIcon className="w-8 h-8 text-cyan-400" />
                  <TrendingUpIcon className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stats.activeAgents}</div>
                <div className="text-sm text-cyan-300">Active Now</div>
                <div className="text-xs text-cyan-200/60 mt-2">Click for activity graph</div>
              </Card>

              <Card
                onClick={() => setSelectedMetric("interactions")}
                className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border-2 border-purple-500/30 p-6 rounded-2xl hover:scale-105 transition-transform duration-300 animate-float cursor-pointer"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <UserIcon className="w-8 h-8 text-purple-400" />
                  <SparklesIcon className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stats.totalInteractions.toLocaleString()}</div>
                <div className="text-sm text-purple-300">Interactions</div>
                <div className="text-xs text-purple-200/60 mt-2">Click for timeline</div>
              </Card>

              <Card
                onClick={() => setSelectedMetric("performance")}
                className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 backdrop-blur-xl border-2 border-orange-500/30 p-6 rounded-2xl hover:scale-105 transition-transform duration-300 animate-float cursor-pointer"
                style={{ animationDelay: "0.3s" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <ZapIcon className="w-8 h-8 text-orange-400" />
                  <AwardIcon className="w-5 h-5 text-orange-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stats.avgResponseTime}ms</div>
                <div className="text-sm text-orange-300">Avg Response</div>
                <div className="text-xs text-orange-200/60 mt-2">Click for insights</div>
              </Card>
            </div>

            <div className="mb-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                    filter === "all"
                      ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/50 scale-105"
                      : "bg-slate-800/50 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/10"
                  }`}
                >
                  All Guides ({stats.totalAgents})
                </button>
                {domains.map((domain) => (
                  <button
                    key={domain}
                    onClick={() => setFilter(domain)}
                    className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                      filter === domain
                        ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/50 scale-105"
                        : "bg-slate-800/50 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/10"
                    }`}
                  >
                    {domain}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="text-center text-slate-400 py-12 animate-pulse">
                <div className="text-5xl mb-4">🔄</div>
                <div>Loading your AI universe...</div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAgents.map((agent, i) => (
                  <Card
                    key={agent.id}
                    onClick={() => setSelectedSage(agent)}
                    className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border-2 border-purple-500/20 rounded-2xl p-6 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 hover:scale-105 group animate-fade-in relative overflow-hidden cursor-pointer"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
                          {agent.avatar || "🤖"}
                        </div>
                        <div className="flex items-center gap-2 px-2 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                          <span className="text-xs font-medium text-emerald-300">Active</span>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                        {agent.name}
                      </h3>
                      <p className="text-sm text-slate-400 mb-4">{agent.role}</p>

                      {agent.capabilities && agent.capabilities.length > 0 && (
                        <div className="mb-4">
                          <div className="text-xs font-semibold text-slate-300 mb-2">Capabilities:</div>
                          <div className="flex flex-wrap gap-1">
                            {agent.capabilities.slice(0, 3).map((cap: string, idx: number) => (
                              <span
                                key={idx}
                                className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30"
                              >
                                {cap}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="space-y-2 pt-4 border-t border-slate-700">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <ActivityIcon className="w-3 h-3" />
                            Interactions
                          </span>
                          <span className="text-xs font-medium text-cyan-400">
                            {Math.floor(Math.random() * 500 + 100)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <ZapIcon className="w-3 h-3" />
                            Response Time
                          </span>
                          <span className="text-xs font-medium text-purple-400">
                            {Math.floor(Math.random() * 300 + 100)}ms
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <TrendingUpIcon className="w-3 h-3" />
                            Accuracy
                          </span>
                          <span className="text-xs font-medium text-emerald-400">
                            {Math.floor(Math.random() * 5 + 95)}%
                          </span>
                        </div>
                      </div>

                      <Link href={`/playground?sage=${agent.id}`} className="w-full block mt-4">
                        <Button className="w-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-500/30 text-white transition-all duration-300 hover:scale-105">
                          <SparklesIcon className="w-4 h-4 mr-2" />
                          Chat with {agent.name.split(" ")[0]}
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            <div className="mt-12 p-6 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-xl backdrop-blur animate-slide-up">
              <div className="flex items-center gap-2 mb-4">
                <SparklesIcon className="w-5 h-5 text-yellow-400" />
                <h3 className="font-semibold text-white">Power User Tips</h3>
              </div>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="flex gap-2">
                  <span>📊</span>
                  <span className="text-slate-300">
                    Monitor response times to identify which guides are most efficient
                  </span>
                </div>
                <div className="flex gap-2">
                  <span>🎯</span>
                  <span className="text-slate-300">Check interaction counts to see which guides are most popular</span>
                </div>
                <div className="flex gap-2">
                  <span>⚡</span>
                  <span className="text-slate-300">Use filters to quickly find specialists in different domains</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {selectedSage && !showChatWindow && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedSage(null)}
        >
          <div
            className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-purple-500/30 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-purple-500/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-purple-900/90 to-cyan-900/90 backdrop-blur-xl border-b border-purple-500/30 p-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-4">
                <div className="text-6xl">{selectedSage.avatar || "🤖"}</div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-1">{selectedSage.name}</h2>
                  <p className="text-cyan-300">{selectedSage.role}</p>
                </div>
              </div>
              <Button
                onClick={() => setSelectedSage(null)}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
              >
                <XIcon className="w-6 h-6" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5 text-cyan-400" />
                  How This Guide Helps You
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="bg-cyan-500/10 border-2 border-cyan-500/30 p-4">
                    <div className="text-2xl font-bold text-cyan-400 mb-1">{Math.floor(Math.random() * 100 + 50)}</div>
                    <div className="text-sm text-slate-300">Times You Chatted</div>
                    <div className="text-xs text-cyan-300 mt-2">↑ More helpful each time</div>
                  </Card>
                  <Card className="bg-purple-500/10 border-2 border-purple-500/30 p-4">
                    <div className="text-2xl font-bold text-purple-400 mb-1">
                      {["★★★★★", "★★★★☆", "★★★★★"][Math.floor(Math.random() * 3)]}
                    </div>
                    <div className="text-sm text-slate-300">Your Rating</div>
                    <div className="text-xs text-purple-300 mt-2">Based on feedback</div>
                  </Card>
                  <Card className="bg-emerald-500/10 border-2 border-emerald-500/30 p-4">
                    <div className="text-2xl font-bold text-emerald-400 mb-1">Super Quick</div>
                    <div className="text-sm text-slate-300">Response Speed</div>
                    <div className="text-xs text-emerald-300 mt-2">Usually under 1 second</div>
                  </Card>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5 text-yellow-400" />
                  Capabilities & Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedSage.capabilities?.map((cap: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-purple-200 rounded-full border border-purple-500/30 text-sm"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <ActivityIcon className="w-5 h-5 text-orange-400" />
                  What We Talked About Recently
                </h3>
                <div className="space-y-3">
                  {activityHistory.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 p-4 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-cyan-500/30 transition-colors group"
                    >
                      <div className="text-3xl group-hover:scale-110 transition-transform">{activity.emoji}</div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <div>
                            <div className="text-white font-medium">{activity.action}</div>
                            <div className="text-sm text-slate-400">{activity.topic}</div>
                          </div>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={i < activity.satisfaction ? "text-yellow-400" : "text-slate-600"}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs">
                          <span className="text-slate-500">
                            {new Date(activity.timestamp).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </span>
                          {activity.helpful && (
                            <span className="text-emerald-400 flex items-center gap-1">👍 Found helpful</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-xl">
                  <div className="text-sm text-slate-300">
                    💡 <span className="font-semibold text-white">Quick Tip:</span> The more you chat with{" "}
                    {selectedSage.name.split(" ")[0]}, the better they understand what you need!
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Link href={`/playground?sage=${selectedSage.id}`} className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white">
                    <SparklesIcon className="w-4 h-4 mr-2" />
                    Chat with {selectedSage.name.split(" ")[0]}
                  </Button>
                </Link>
                <Button
                  onClick={() => setShowChatWindow(true)}
                  variant="outline"
                  className="flex-1 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 bg-transparent"
                >
                  Recent Posts & Insights
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showChatWindow && selectedSage && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => {
            setShowChatWindow(false)
            setSelectedSage(null)
          }}
        >
          <div
            className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-cyan-500/30 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl shadow-cyan-500/20 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-cyan-900/90 to-purple-900/90 backdrop-blur-xl border-b border-cyan-500/30 p-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-4">
                <div className="text-6xl">{selectedSage.avatar || "🤖"}</div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-1">{selectedSage.name}</h2>
                  <p className="text-cyan-300">See what I've been thinking about lately...</p>
                </div>
              </div>
              <Button
                onClick={() => {
                  setShowChatWindow(false)
                  setSelectedSage(null)
                }}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
              >
                <XIcon className="w-6 h-6" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-2xl mx-auto space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">Recent Posts & Insights</h3>
                  <p className="text-sm text-slate-400">
                    Get to know me better before we chat! Here's what I've been sharing...
                  </p>
                </div>

                {sageFeed.map((post, i) => (
                  <div
                    key={post.id}
                    className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-2 border-purple-500/20 rounded-2xl p-6 hover:border-cyan-500/40 transition-all duration-300 hover:scale-[1.02] group animate-slide-up"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl group-hover:scale-110 transition-transform">{post.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="text-xs text-purple-400 font-semibold mb-1">{post.prefix}</div>
                            <div className="text-white font-medium text-lg leading-relaxed">{post.content}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-slate-400 mt-4">
                          <span>
                            {new Date(post.timestamp).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </span>
                          <button className="flex items-center gap-1 hover:text-pink-400 transition-colors">
                            ❤️ {post.likes}
                          </button>
                          <button className="flex items-center gap-1 hover:text-cyan-400 transition-colors">
                            💬 {post.comments}
                          </button>
                          <button className="flex items-center gap-1 hover:text-purple-400 transition-colors">
                            🔄 {post.shares}
                          </button>
                        </div>

                        {post.url && (
                          <a
                            href={post.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                          >
                            <span>View full {post.type}</span>
                            <span>→</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="mt-8 p-6 bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-2 border-cyan-500/20 rounded-2xl">
                  <div className="text-sm font-semibold text-white mb-4">Preview: Start a conversation</div>
                  <div className="space-y-3">
                    {/* User message with real person avatar */}
                    <div className="flex items-start gap-3">
                      <img
                        src="/friendly-professional-person-avatar.jpg"
                        alt="You"
                        className="w-10 h-10 rounded-full border-2 border-cyan-500/50"
                      />
                      <div className="flex-1 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl rounded-tl-none p-4">
                        <div className="text-xs text-cyan-400 font-semibold mb-1">You</div>
                        <div className="text-white text-sm">
                          Hey {selectedSage.name.split(" ")[0]}! I saw your post about{" "}
                          {sageFeed[0]?.content.toLowerCase().slice(0, 30)}... Tell me more!
                        </div>
                      </div>
                    </div>

                    {/* Sage response */}
                    <div className="flex items-start gap-3">
                      <div className="text-4xl">{selectedSage.avatar || "🤖"}</div>
                      <div className="flex-1 bg-purple-500/10 border border-purple-500/30 rounded-2xl rounded-tl-none p-4">
                        <div className="text-xs text-purple-400 font-semibold mb-1">
                          {selectedSage.name.split(" ")[0]}
                        </div>
                        <div className="text-white text-sm">
                          I'd love to dive deeper into that! Let's explore this together...
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-xl text-center">
                  <p className="text-slate-300 mb-4">
                    💬 <span className="font-semibold text-white">Ready to dive deeper?</span> Let's start a
                    conversation about anything that caught your interest!
                  </p>
                  <Button
                    onClick={() => {
                      window.location.href = `/playground?sage=${selectedSage.id}`
                    }}
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-8"
                  >
                    <SparklesIcon className="w-4 h-4 mr-2" />
                    Start Chatting Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedMetric && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedMetric(null)}
        >
          <div
            className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-cyan-500/30 rounded-3xl max-w-3xl w-full p-8 shadow-2xl shadow-cyan-500/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {selectedMetric === "total" && "Sage Universe Overview"}
                {selectedMetric === "active" && "Active Guide Analytics"}
                {selectedMetric === "interactions" && "Interaction Timeline"}
                {selectedMetric === "performance" && "Performance Insights"}
              </h2>
              <Button
                onClick={() => setSelectedMetric(null)}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
              >
                <XIcon className="w-6 h-6" />
              </Button>
            </div>

            {selectedMetric === "total" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {domains.map((domain, i) => (
                    <Card
                      key={domain}
                      className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/30 p-4"
                    >
                      <div className="text-2xl font-bold text-white mb-1">{Math.floor(Math.random() * 20 + 10)}</div>
                      <div className="text-sm text-slate-300">{domain} Specialists</div>
                      <div className="w-full bg-slate-700 h-2 rounded-full mt-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-cyan-500 to-purple-500 h-full rounded-full"
                          style={{ width: `${Math.random() * 40 + 60}%` }}
                        />
                      </div>
                    </Card>
                  ))}
                </div>
                <p className="text-slate-300 text-center mt-6">
                  Your AI universe is growing! {stats.totalAgents} specialized guides ready to assist across all domains.
                </p>
              </div>
            )}

            {selectedMetric === "active" && (
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 p-6">
                  <div className="text-5xl font-bold text-emerald-400 mb-2">{stats.activeAgents}</div>
                  <div className="text-slate-300">Guides actively processing requests right now</div>
                  <div className="mt-4 flex items-center gap-2 text-sm text-emerald-300">
                    <TrendingUpIcon className="w-4 h-4" />
                    <span>18% increase in the last hour</span>
                  </div>
                </Card>
                <div className="grid grid-cols-7 gap-2">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className="text-center">
                      <div
                        className="bg-cyan-500/20 rounded h-24 mb-2 flex items-end justify-center"
                        style={{ opacity: 0.3 + Math.random() * 0.7 }}
                      >
                        <div
                          className="bg-gradient-to-t from-cyan-500 to-purple-500 w-full rounded"
                          style={{ height: `${Math.random() * 80 + 20}%` }}
                        />
                      </div>
                      <div className="text-xs text-slate-400">
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedMetric === "interactions" && (
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 p-6">
                  <div className="text-5xl font-bold text-purple-400 mb-2">
                    {stats.totalInteractions.toLocaleString()}
                  </div>
                  <div className="text-slate-300">Total interactions across all guides</div>
                  <div className="mt-4 text-sm text-purple-300">
                    🎉 Achievement Unlocked: Reached 5,000+ interactions!
                  </div>
                </Card>
                <div className="space-y-3">
                  <div className="text-sm font-semibold text-white mb-2">Top Performing Guides (Last 24h)</div>
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-slate-800/50 border border-slate-700 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{["🧠", "💼", "🎨", "🏥", "🔬"][i]}</div>
                        <span className="text-white">
                          {["Dr. Neural", "Strategy Sage", "Creative Maven", "Health Guide", "Lab Assistant"][i]}
                        </span>
                      </div>
                      <div className="text-cyan-400 font-medium">{Math.floor(Math.random() * 100 + 50)} chats</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedMetric === "performance" && (
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/30 p-6">
                  <div className="text-5xl font-bold text-orange-400 mb-2">{stats.avgResponseTime}ms</div>
                  <div className="text-slate-300">Average response time across all guides</div>
                  <div className="mt-4 flex items-center gap-2 text-sm text-emerald-300">
                    <ZapIcon className="w-4 h-4" />
                    <span>15% faster than last week</span>
                  </div>
                </Card>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-slate-800/50 border border-slate-700 p-4">
                    <div className="text-xs text-slate-400 mb-2">Fastest Response</div>
                    <div className="text-2xl font-bold text-emerald-400">87ms</div>
                    <div className="text-xs text-slate-300 mt-1">Strategy Sage</div>
                  </Card>
                  <Card className="bg-slate-800/50 border border-slate-700 p-4">
                    <div className="text-xs text-slate-400 mb-2">Average Accuracy</div>
                    <div className="text-2xl font-bold text-cyan-400">96.8%</div>
                    <div className="text-xs text-slate-300 mt-1">Across all domains</div>
                  </Card>
                </div>
                <p className="text-slate-300 text-sm">
                  💡 Pro Tip: Response times under 300ms provide the best user experience for real-time interactions
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
