import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Code } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Technical Documentation - SageSpace',
  description: 'Architecture and implementation details',
}

export default function TechnicalDocsPage() {
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
              <Code className="h-8 w-8 text-pink-400" />
              <h1 className="text-4xl font-bold m-0 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Technical Documentation
              </h1>
            </div>
            <p className="text-muted-foreground mb-8">
              Deep dive into SageSpace architecture, APIs, and implementation details.
            </p>
            
            <div className="space-y-8">
              <section id="architecture-overview">
                <h2 className="text-2xl font-bold mb-3 text-cyan-400">Architecture Overview</h2>
                <p className="text-muted-foreground mb-4">
                  SageSpace is built on Next.js 16 with React 19, leveraging the latest features for performance and developer experience.
                </p>
                
                <h3 className="text-xl font-semibold mb-2 text-purple-300">Tech Stack</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li><strong>Framework</strong>: Next.js 16 (App Router, Server Components)</li>
                  <li><strong>Database</strong>: Supabase (PostgreSQL with RLS)</li>
                  <li><strong>AI</strong>: Vercel AI SDK v5, multiple providers via AI Gateway</li>
                  <li><strong>Payments</strong>: Stripe for subscriptions</li>
                  <li><strong>Styling</strong>: Tailwind CSS v4, shadcn/ui components</li>
                  <li><strong>Auth</strong>: Supabase Auth with email/password</li>
                </ul>
              </section>

              <section id="self-evolving-system">
                <h2 className="text-2xl font-bold mb-3 text-cyan-400">Self-Evolving System</h2>
                
                <h3 className="text-xl font-semibold mb-2 text-purple-300">Observability Layer</h3>
                <p className="text-muted-foreground mb-2">
                  Tracks user behavior invisibly in the background:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Page views and navigation patterns</li>
                  <li>Time on page and click events</li>
                  <li>Friction points (errors, dead ends)</li>
                  <li>Success signals (completions, subscriptions)</li>
                </ul>

                <h3 className="text-xl font-semibold mb-2 mt-4 text-purple-300">AI Dreamer</h3>
                <p className="text-muted-foreground mb-2">
                  Analyzes behavior data and generates UX improvement proposals:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Identifies navigation friction and suggests optimizations</li>
                  <li>Detects unused features and proposes removal or improvement</li>
                  <li>Learns user preferences over time</li>
                  <li>Generates proposals based on behavior patterns</li>
                </ul>

                <h3 className="text-xl font-semibold mb-2 mt-4 text-purple-300">Governance Layer</h3>
                <p className="text-muted-foreground mb-2">
                  10 strict policies filter all AI-generated proposals:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>No removal of safety features</li>
                  <li>No data exfiltration</li>
                  <li>No removing legal requirements</li>
                  <li>Respect privacy settings</li>
                  <li>Preserve core features</li>
                  <li>No breaking changes</li>
                  <li>No manipulative patterns</li>
                  <li>Fair monetization only</li>
                  <li>Maintain sage boundaries</li>
                  <li>No AI hallucinations</li>
                </ol>

                <h3 className="text-xl font-semibold mb-2 mt-4 text-purple-300">User Approval Console</h3>
                <p className="text-muted-foreground">
                  Located in Settings → Adaptive Mode. Users review proposals, approve/reject changes, 
                  and earn Design Karma points for participation.
                </p>
              </section>

              <section id="database-schema">
                <h2 className="text-2xl font-bold mb-3 text-cyan-400">Database Schema</h2>
                <p className="text-muted-foreground mb-4">
                  SageSpace uses 36+ tables organized by feature area. Key tables include:
                </p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-purple-300">User Management</h4>
                    <p className="text-sm text-muted-foreground">profiles, user_preferences, user_progress</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-purple-300">AI Conversations</h4>
                    <p className="text-sm text-muted-foreground">conversations, messages, council_sessions</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-purple-300">Personalization</h4>
                    <p className="text-sm text-muted-foreground">user_personalization, observability_events, ai_proposal_history</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-purple-300">Gamification</h4>
                    <p className="text-sm text-muted-foreground">user_design_karma, achievements, quests</p>
                  </div>
                </div>
              </section>

              <section id="api-reference">
                <h2 className="text-2xl font-bold mb-3 text-cyan-400">API Reference</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-purple-300">Chat APIs</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground font-mono">
                      <li>POST /api/chat - 1:1 Sage conversations</li>
                      <li>POST /api/council/deliberate - Multi-Sage deliberations</li>
                      <li>GET /api/conversations - List user conversations</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-purple-300">Personalization APIs</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground font-mono">
                      <li>POST /api/dreamer/analyze - Trigger AI analysis</li>
                      <li>GET /api/personalization - Get user proposals</li>
                      <li>POST /api/proposals/approve - Approve a proposal</li>
                      <li>POST /api/proposals/reject - Reject a proposal</li>
                      <li>POST /api/observability/track - Track user events</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-purple-300">User APIs</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground font-mono">
                      <li>GET /api/user/me - Get current user</li>
                      <li>GET /api/passport - Get user passport (gamification)</li>
                      <li>GET /api/subscriptions/me - Get subscription status</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section id="contributing">
                <h2 className="text-2xl font-bold mb-3 text-cyan-400">Contributing</h2>
                <p className="text-muted-foreground mb-4">
                  SageSpace evolves through careful, measured improvements aligned with Success Criteria.
                </p>
                
                <h3 className="text-xl font-semibold mb-2 text-purple-300">Before Adding Features</h3>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>Check if it aligns with Success Criteria</li>
                  <li>Consider if it's necessary (avoid feature bloat)</li>
                  <li>Update Success Criteria document if accepted</li>
                  <li>Implement with tests and documentation</li>
                  <li>Verify governance policies still pass</li>
                </ol>
              </section>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
