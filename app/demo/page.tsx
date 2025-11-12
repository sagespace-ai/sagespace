"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EyeIcon, ScaleIcon, BrainIcon, MessageSquareIcon, SparklesIcon, HomeIcon } from "@/components/icons"

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-slate-900 to-black">
      {/* Animated stars */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.5 + 0.2,
            }}
          />
        ))}
      </div>

      <div className="relative container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Agent Universe Hub
            </h1>
            <p className="text-slate-400">Explore, monitor, and interact with your AI agent ecosystem</p>
          </div>
          <Link href="/">
            <Button variant="ghost" className="text-slate-300">
              <HomeIcon className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Link href="/playground">
            <Card className="bg-slate-900/50 border-cyan-500/20 backdrop-blur-sm hover:border-cyan-500/40 transition-colors cursor-pointer">
              <CardHeader>
                <MessageSquareIcon className="w-12 h-12 text-cyan-400 mb-2" />
                <CardTitle className="text-white">Playground</CardTitle>
                <CardDescription>Chat with AI agents</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/observatory">
            <Card className="bg-slate-900/50 border-purple-500/20 backdrop-blur-sm hover:border-purple-500/40 transition-colors cursor-pointer">
              <CardHeader>
                <EyeIcon className="w-12 h-12 text-purple-400 mb-2" />
                <CardTitle className="text-white">Observatory</CardTitle>
                <CardDescription>Monitor agent interactions</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/council">
            <Card className="bg-slate-900/50 border-cyan-500/20 backdrop-blur-sm hover:border-cyan-500/40 transition-colors cursor-pointer">
              <CardHeader>
                <ScaleIcon className="w-12 h-12 text-cyan-400 mb-2" />
                <CardTitle className="text-white">Council</CardTitle>
                <CardDescription>Multi-agent voting</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/memory">
            <Card className="bg-slate-900/50 border-purple-500/20 backdrop-blur-sm hover:border-purple-500/40 transition-colors cursor-pointer">
              <CardHeader>
                <BrainIcon className="w-12 h-12 text-purple-400 mb-2" />
                <CardTitle className="text-white">Memory</CardTitle>
                <CardDescription>Agent learning dashboard</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Additional Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/multiverse">
            <Card className="bg-slate-900/50 border-purple-500/20 backdrop-blur-sm hover:border-purple-500/40 transition-colors cursor-pointer">
              <CardHeader>
                <SparklesIcon className="w-10 h-10 text-purple-400 mb-2" />
                <CardTitle className="text-white">Multiverse</CardTitle>
                <CardDescription>Persistent conversations by role</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/universe-map">
            <Card className="bg-slate-900/50 border-cyan-500/20 backdrop-blur-sm hover:border-cyan-500/40 transition-colors cursor-pointer">
              <CardHeader>
                <SparklesIcon className="w-10 h-10 text-cyan-400 mb-2" />
                <CardTitle className="text-white">Universe Map</CardTitle>
                <CardDescription>Spatial agent visualization</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/persona-editor">
            <Card className="bg-slate-900/50 border-purple-500/20 backdrop-blur-sm hover:border-purple-500/40 transition-colors cursor-pointer">
              <CardHeader>
                <SparklesIcon className="w-10 h-10 text-purple-400 mb-2" />
                <CardTitle className="text-white">Persona Editor</CardTitle>
                <CardDescription>Create custom agents</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
