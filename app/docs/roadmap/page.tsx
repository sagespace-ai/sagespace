import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Roadmap - SageSpace',
  description: "What's coming next to SageSpace",
}

export default function RoadmapPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <Link href="/docs">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Docs
            </Button>
          </Link>
        </div>
        
        <article className="prose prose-invert prose-cyan max-w-none">
          <div className="border border-purple-500/20 rounded-lg p-8 bg-black/40 backdrop-blur">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="h-8 w-8 text-pink-400" />
              <h1 className="text-4xl font-bold m-0 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Roadmap
              </h1>
            </div>
            <p className="text-muted-foreground mb-8">
              The future of SageSpace - planned features and long-term vision.
            </p>
            
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4 text-cyan-400">Q1 2025 - Dreamer v2</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-purple-300">Behavioral Signal Collection</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Semantic analysis of navigation patterns</li>
                      <li>Page classification (landing, feature, transactional)</li>
                      <li>Friction point detection with root cause analysis</li>
                      <li>Success signal tracking (conversions, completions)</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-purple-300">UX Template Library</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>12 concrete proposal types with SQL snippets</li>
                      <li>Scoring model for prioritization</li>
                      <li>A/B test framework for proposals</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-purple-300">Enhanced Governance</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Expanded policy set with examples</li>
                      <li>Human-readable explanations for rejections</li>
                      <li>Audit log for all governance decisions</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-cyan-400">Q2 2025 - Sage Marketplace</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-purple-300">Custom Sage Creation</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>User-created Sages with custom domains</li>
                      <li>Sage Builder with template library</li>
                      <li>Community review and rating system</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-purple-300">Sage Collaboration</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Multi-user Council sessions</li>
                      <li>Sage-to-Sage tool calling</li>
                      <li>Shared workspace for teams</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-cyan-400">Q3 2025 - Observatory</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-purple-300">Personal Analytics Dashboard</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Usage patterns and insights</li>
                      <li>Conversation topic analysis</li>
                      <li>Sage preference tracking</li>
                      <li>Growth metrics and milestones</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-purple-300">Knowledge Graph</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Visual map of your conversations</li>
                      <li>Topic clustering and connections</li>
                      <li>Sage network visualization</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-cyan-400">Q4 2025 - Enterprise Features</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-purple-300">Team Workspaces</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Organization accounts with role-based access</li>
                      <li>Shared Sage libraries</li>
                      <li>Team analytics and insights</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-purple-300">Advanced Integrations</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Slack, Discord, Teams bots</li>
                      <li>API access for custom integrations</li>
                      <li>Webhooks for event streaming</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-cyan-400">Long-Term Vision</h2>
                <p className="text-muted-foreground mb-4">
                  SageSpace aims to become the definitive human-AI collaboration platform where:
                </p>
                
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li><strong>AI serves humans</strong>: No black boxes, full transparency and control</li>
                  <li><strong>Expertise is preserved</strong>: Sages stay in their domains</li>
                  <li><strong>Continuous evolution</strong>: Platform adapts but never without consent</li>
                  <li><strong>Community-driven</strong>: Users shape features through Design Karma</li>
                  <li><strong>Open architecture</strong>: APIs and integrations for extensibility</li>
                </ul>
              </section>

              <section>
                <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <p className="text-sm text-purple-300 font-semibold mb-2">Have Ideas?</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    We'd love to hear your feature requests and ideas. Every suggestion is reviewed and considered 
                    for alignment with our Success Criteria.
                  </p>
                  <Link href="/settings">
                    <Button size="sm" variant="outline" className="border-purple-500/50 hover:bg-purple-500/10">
                      Submit Feature Request
                    </Button>
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
