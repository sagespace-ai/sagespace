import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { readFileSync } from 'fs'
import { join } from 'path'

export const metadata: Metadata = {
  title: 'User Guide - SageSpace',
  description: 'Learn how to use SageSpace effectively',
}

export default function UserGuidePage() {
  // In production, you'd parse the markdown file and render it
  // For now, we'll create a simple viewer
  
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
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              User Guide
            </h1>
            <p className="text-muted-foreground mb-8">
              Welcome to SageSpace - the self-evolving AI universe that adapts to you.
            </p>
            
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-3 text-cyan-400">Getting Started</h2>
                <p className="text-muted-foreground mb-4">
                  SageSpace is an AI platform where you interact with specialized AI agents called Sages. 
                  Each Sage is an expert in a specific domain - from creative writing to data analysis to philosophical debate.
                </p>
                
                <h3 className="text-xl font-semibold mb-2 text-purple-300">What Makes SageSpace Unique</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li><strong>Self-Healing</strong>: The platform detects and fixes errors automatically</li>
                  <li><strong>User-Evolving</strong>: The AI observes your patterns and suggests improvements</li>
                  <li><strong>You're in Control</strong>: No changes happen without your approval</li>
                  <li><strong>Domain-Specialized Sages</strong>: Each AI stays in its expertise area</li>
                </ul>
                
                <h3 className="text-xl font-semibold mb-2 mt-4 text-purple-300">Your First Steps</h3>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>Sign Up - Create your account at the landing page</li>
                  <li>Complete Genesis Chamber - Quick onboarding to set preferences</li>
                  <li>Visit the Hub - Your dashboard and starting point</li>
                  <li>Choose a Sage - Browse the Multiverse or use the Playground</li>
                  <li>Start Chatting - Ask questions, get answers, explore</li>
                </ol>
              </section>
              
              <section>
                <h2 className="text-2xl font-bold mb-3 text-cyan-400">Core Features</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-purple-300">Hub</h3>
                    <p className="text-muted-foreground">
                      Your command center. See recent activity, resume sessions, and quick actions.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-purple-300">Playground</h3>
                    <p className="text-muted-foreground">
                      1:1 conversations with any Sage. Features include real-time streaming, mood selector, 
                      Council escalation, and Guide discovery.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-purple-300">Council</h3>
                    <p className="text-muted-foreground">
                      Multi-Sage deliberations where 3-5 Sages discuss your question together, providing 
                      diverse perspectives and synthesized answers.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-purple-300">Memory</h3>
                    <p className="text-muted-foreground">
                      Your conversation history, organized and searchable. Browse past sessions, search 
                      across conversations, and resume any session.
                    </p>
                  </div>
                </div>
              </section>
              
              <section>
                <h2 className="text-2xl font-bold mb-3 text-cyan-400">The Adaptive System</h2>
                <p className="text-muted-foreground mb-4">
                  SageSpace includes an AI system called the <strong>Dreamer</strong> that observes how you 
                  use the platform, identifies patterns, and generates improvement proposals.
                </p>
                
                <h3 className="text-xl font-semibold mb-2 text-purple-300">Reviewing Proposals</h3>
                <p className="text-muted-foreground mb-2">
                  Go to <strong>Settings → Adaptive Mode</strong> to see AI-generated proposals.
                </p>
                
                <p className="text-muted-foreground mb-2">For each proposal you can:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li><strong>Approve</strong>: Apply the change immediately</li>
                  <li><strong>Reject</strong>: Decline and help AI learn your preferences</li>
                  <li><strong>Ask Why</strong>: See detailed reasoning</li>
                </ul>
                
                <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <p className="text-sm text-purple-300 font-semibold mb-2">Governance & Safety</p>
                  <p className="text-sm text-muted-foreground">
                    All proposals pass through 10 strict governance policies. You'll never see proposals 
                    that remove safety features, compromise privacy, break functionality, or manipulate behavior.
                  </p>
                </div>
              </section>
              
              <section>
                <h2 className="text-2xl font-bold mb-3 text-cyan-400">Need Help?</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li><Link href="/docs/technical" className="text-cyan-400 hover:underline">Technical Documentation</Link> - For developers and architects</li>
                  <li><Link href="/docs/success-criteria" className="text-cyan-400 hover:underline">Success Criteria</Link> - The DNA of the platform</li>
                  <li><Link href="/docs/faq" className="text-cyan-400 hover:underline">FAQ</Link> - Frequently asked questions</li>
                  <li><Link href="/settings" className="text-cyan-400 hover:underline">Contact Support</Link> - Get personalized help</li>
                </ul>
              </section>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
