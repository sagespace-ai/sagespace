"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart } from "@/components/icons"
import { getAllDomains, getSagesByDomain } from "@/lib/sage-templates"

export default function MarketingPage() {
  const domains = getAllDomains()

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-slate-900 to-black">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>
      {/* </CHANGE> */}

      <header className="relative border-b border-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
          >
            SageSpace
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/demo">
              <Button variant="ghost">Demo</Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Where AI Agents Collaborate With Human Wisdom
          </h1>

          <p className="text-xl text-muted-foreground">
            Build ethical, transparent AI agent systems governed by the Five Laws of AI Harmony
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link href="/demo">
              <Button
                size="lg"
                className="text-lg relative group overflow-hidden bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 hover:shadow-2xl border-0"
              >
                <span className="relative z-10">Try the Playground</span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
              </Button>
            </Link>
            <Link href="/marketplace">
              <Button
                size="lg"
                variant="outline"
                className="text-lg relative group overflow-hidden bg-transparent border-2 border-purple-500/50 hover:border-cyan-400 text-white transition-all duration-300 shadow-lg hover:shadow-purple-500/50 hover:shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-cyan-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl" />
                <BarChart className="mr-2 h-5 w-5 relative z-10 group-hover:text-cyan-400 transition-colors" />
                <span className="relative z-10">Meet the Sages</span>
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <section className="relative py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Meet the Sages
            </h2>
            <p className="text-slate-400 text-lg">Add a Sage to your Universe</p>
          </div>

          <div className="space-y-12">
            {domains.map((domain) => {
              const sages = getSagesByDomain(domain)
              return (
                <div key={domain} className="space-y-6">
                  <h3 className="text-2xl font-bold text-white border-l-4 border-cyan-400 pl-4">{domain}</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sages.map((sage) => (
                      <div
                        key={sage.id}
                        className="group bg-slate-900/50 border border-purple-500/20 backdrop-blur-sm p-6 rounded-lg hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20"
                      >
                        <div className="flex items-start gap-4">
                          <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                            {sage.avatar}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                              {sage.name}
                            </h4>
                            <p className="text-sm text-purple-400 mb-2">{sage.role}</p>
                            <p className="text-sm text-slate-400 mb-3">{sage.description}</p>
                            <div className="flex flex-wrap gap-2">
                              {sage.capabilities.slice(0, 2).map((cap) => (
                                <span
                                  key={cap}
                                  className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full"
                                >
                                  {cap}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="text-center mt-12">
            <Link href="/marketplace">
              <Button
                size="lg"
                className="text-lg relative group overflow-hidden bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 transition-all duration-300"
              >
                <span className="relative z-10">Explore All Sages</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      {/* </CHANGE> */}

      <section className="relative py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">The Five Laws Guide Every Agent</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-900/50 border border-purple-500/20 backdrop-blur-sm p-6 rounded-lg">
              <div className="text-cyan-400 mb-4">⚖️</div>
              <h3 className="text-xl font-bold text-white mb-2">Human Primacy</h3>
              <p className="text-slate-300">Humans remain central. Agents assist and augment, never replace.</p>
            </div>
            <div className="bg-slate-900/50 border border-purple-500/20 backdrop-blur-sm p-6 rounded-lg">
              <div className="text-purple-400 mb-4">🤖</div>
              <h3 className="text-xl font-bold text-white mb-2">Autonomy</h3>
              <p className="text-slate-300">Agents operate independently within ethical boundaries.</p>
            </div>
            <div className="bg-slate-900/50 border border-purple-500/20 backdrop-blur-sm p-6 rounded-lg">
              <div className="text-cyan-400 mb-4">👁️</div>
              <h3 className="text-xl font-bold text-white mb-2">Transparency</h3>
              <p className="text-slate-300">All agent decisions are visible and explainable to humans.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
