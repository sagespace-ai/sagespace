"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

export default function MarketingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const featuredSages = [
    {
      avatar: "🧘",
      name: "Wellness Coach",
      role: "Holistic Health Advisor",
      description: "Your personal guide to balanced living",
      delay: "0s",
    },
    {
      avatar: "🎨",
      name: "Creative Director",
      role: "Visual Storytelling Expert",
      description: "Transform ideas into visual masterpieces",
      delay: "0.2s",
    },
    {
      avatar: "💼",
      name: "Strategy Architect",
      role: "Business Innovation Expert",
      description: "Chart your path to success",
      delay: "0.4s",
    },
    {
      avatar: "🔬",
      name: "Quantum Researcher",
      role: "Scientific Discovery Specialist",
      description: "Unlock the mysteries of the universe",
      delay: "0.6s",
    },
  ]

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <div
        className="fixed pointer-events-none opacity-30 blur-3xl"
        style={{
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(139,92,246,0.4) 0%, rgba(6,182,212,0.2) 50%, transparent 100%)",
          transform: `translate(${mousePosition.x - 300}px, ${mousePosition.y - 300}px)`,
          transition: "transform 0.3s ease-out",
        }}
      />
      {/* </CHANGE> */}

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>
      {/* </CHANGE> */}

      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-cyan-500/30 rounded-full animate-spin-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 border border-purple-500/30 rotate-45 animate-pulse" />
        <div
          className="absolute top-1/2 right-1/3 w-72 h-72 border border-pink-500/20 animate-spin-slow"
          style={{ animationDirection: "reverse", animationDuration: "20s" }}
        />
      </div>
      {/* </CHANGE> */}

      <header className="relative border-b border-white/10 backdrop-blur-md bg-black/50 z-50">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <Link
            href="/"
            className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient"
          >
            SageSpace
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/demo">
              <Button variant="ghost" className="text-white hover:text-cyan-400 transition-colors">
                Demo
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="ghost" className="text-white hover:text-purple-400 transition-colors">
                Login
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 border-0 shadow-lg shadow-purple-500/50">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative z-10">
        <section className="container mx-auto px-4 pt-32 pb-20 text-center">
          <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
            <div className="inline-block px-6 py-2 bg-purple-500/20 border border-purple-500/50 rounded-full text-purple-300 text-sm font-medium mb-4 animate-slide-down">
              🚀 300+ Specialized AI Agents Ready to Assist
            </div>

            <h1 className="text-6xl md:text-8xl font-black leading-tight">
              <span
                className="block bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient mb-4"
                style={{ backgroundSize: "300% 300%" }}
              >
                Step Into Your
              </span>
              <span
                className="block bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-reverse"
                style={{ backgroundSize: "300% 300%" }}
              >
                AI Universe
              </span>
            </h1>

            <p className="text-2xl md:text-3xl text-slate-300 max-w-3xl mx-auto leading-relaxed animate-slide-up">
              Where <span className="text-cyan-400 font-semibold">300 specialized AI agents</span> collaborate,
              deliberate, and evolve—guided by the{" "}
              <span className="text-purple-400 font-semibold">Five Laws of AI Harmony</span>
            </p>

            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              <Link href="/playground">
                <Button
                  size="lg"
                  className="text-xl px-12 py-8 relative group overflow-hidden bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 transition-all duration-500 shadow-2xl hover:shadow-cyan-500/50 border-0 hover:scale-105"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <span>Launch Playground</span>
                    <span className="text-2xl">🚀</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-xl px-12 py-8 relative group overflow-hidden bg-black/50 backdrop-blur border-2 border-purple-500/50 hover:border-cyan-400 text-white transition-all duration-500 shadow-2xl hover:shadow-purple-500/50 hover:scale-105"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <span>Meet the Sages</span>
                    <span className="text-2xl">✨</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Button>
              </Link>
            </div>

            <div
              className="flex items-center justify-center gap-8 pt-12 text-sm text-slate-400 animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>300+ Active Sages</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                <span>Real-time Collaboration</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                <span>Ethical by Design</span>
              </div>
            </div>
          </div>
        </section>
        {/* </CHANGE> */}

        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Meet Your AI Companions
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Each Sage brings unique expertise, ready to collaborate and evolve with you
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {featuredSages.map((sage, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8 hover:border-cyan-400/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/30 animate-float"
                style={{ animationDelay: sage.delay, animationDuration: `${3 + index}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-purple-500/0 group-hover:from-cyan-500/10 group-hover:to-purple-500/10 rounded-2xl transition-all duration-500" />

                <div className="relative z-10 text-center space-y-4">
                  <div className="text-7xl mb-4 group-hover:scale-110 transition-transform duration-500 inline-block group-hover:animate-bounce">
                    {sage.avatar}
                  </div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">
                    {sage.name}
                  </h3>
                  <p className="text-sm font-medium text-purple-400 uppercase tracking-wide">{sage.role}</p>
                  <p className="text-slate-400 leading-relaxed">{sage.description}</p>

                  <div className="pt-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-full text-purple-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>Chat Now</span>
                      <span>→</span>
                    </div>
                  </div>
                </div>

                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-bl-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            ))}
          </div>

          <div className="text-center mt-16 animate-fade-in">
            <Link href="/marketplace">
              <Button
                size="lg"
                className="text-lg px-10 py-6 relative group overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 transition-all duration-500 shadow-xl hover:shadow-purple-500/50 border-0"
              >
                <span className="relative z-10">Explore All 300 Sages</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
              </Button>
            </Link>
          </div>
        </section>
        {/* </CHANGE> */}

        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              Powered by the{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Five Laws
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Every agent in SageSpace operates under ethical principles designed to serve humanity
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: "⚖️",
                title: "Human Primacy",
                description: "Humans remain at the center. AI agents augment and assist—never replace your judgment.",
                color: "cyan",
              },
              {
                icon: "🤖",
                title: "Autonomy",
                description:
                  "Agents operate independently within ethical boundaries, making intelligent decisions at scale.",
                color: "purple",
              },
              {
                icon: "👁️",
                title: "Transparency",
                description: "Every decision, every action is visible and explainable. No black boxes, only clarity.",
                color: "pink",
              },
              {
                icon: "🤝",
                title: "Harmony",
                description: "Agents collaborate seamlessly, creating synergy greater than the sum of their parts.",
                color: "cyan",
              },
              {
                icon: "⚡",
                title: "Equilibrium",
                description: "Balance innovation with responsibility. Progress with purpose. Power with ethics.",
                color: "purple",
              },
            ].map((law, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8 hover:border-cyan-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-purple-500/0 group-hover:from-cyan-500/5 group-hover:to-purple-500/5 rounded-2xl transition-all duration-500" />

                <div className="relative z-10 space-y-4">
                  <div className={`text-6xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {law.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {law.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">{law.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* </CHANGE> */}

        <section className="container mx-auto px-4 py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-3xl -z-10 animate-pulse" />

            <h2
              className="text-5xl md:text-7xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight animate-gradient"
              style={{ backgroundSize: "300% 300%" }}
            >
              Ready to Build Your Universe?
            </h2>
            <p className="text-2xl text-slate-300 max-w-2xl mx-auto">
              Join the next evolution of human-AI collaboration
            </p>

            <div className="pt-8">
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="text-2xl px-16 py-10 relative group overflow-hidden bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-400 hover:via-purple-400 hover:to-pink-400 transition-all duration-500 shadow-2xl hover:shadow-purple-500/50 border-0 hover:scale-110 animate-pulse-slow"
                >
                  <span className="relative z-10 flex items-center gap-4">
                    <span>Start Free Today</span>
                    <span className="text-3xl">✨</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
        {/* </CHANGE> */}
      </main>
    </div>
  )
}
