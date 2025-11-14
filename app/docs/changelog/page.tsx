import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Changelog - SageSpace',
  description: 'Platform updates and releases',
}

export default function ChangelogPage() {
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
              <FileText className="h-8 w-8 text-purple-400" />
              <h1 className="text-4xl font-bold m-0 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Changelog
              </h1>
            </div>
            <p className="text-muted-foreground mb-8">
              Track SageSpace updates, new features, and improvements.
            </p>
            
            <div className="space-y-8">
              <section>
                <div className="flex items-baseline gap-3 mb-3">
                  <h2 className="text-2xl font-bold text-cyan-400 m-0">v1.0.0</h2>
                  <span className="text-sm text-muted-foreground">December 2024</span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-purple-300">New Features</h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li><strong>Self-Evolving System</strong>: AI Dreamer analyzes your behavior and generates UX proposals</li>
                      <li><strong>Adaptive Mode Console</strong>: Review and approve AI-generated improvements in Settings</li>
                      <li><strong>Design Karma</strong>: Gamified proposal review system with points and levels</li>
                      <li><strong>Governance Layer</strong>: 10 strict policies ensure safe AI proposals</li>
                      <li><strong>LangGraph Orchestration</strong>: Enhanced AI workflows with error recovery</li>
                      <li><strong>Self-Healing</strong>: Automatic error detection and fix proposals</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-purple-300">Core Features</h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li><strong>Hub</strong>: Your command center and dashboard</li>
                      <li><strong>Playground</strong>: 1:1 conversations with any Sage</li>
                      <li><strong>Council</strong>: Multi-Sage deliberations</li>
                      <li><strong>Multiverse</strong>: Browse and discover Sages</li>
                      <li><strong>Memory</strong>: Conversation history with search</li>
                      <li><strong>Genesis Chamber</strong>: Onboarding experience</li>
                      <li><strong>SageSpace Passport</strong>: Gamification and achievements</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-purple-300">Settings Tabs</h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li><strong>Profile</strong>: Manage your account details</li>
                      <li><strong>Appearance</strong>: Theme and display preferences</li>
                      <li><strong>Studio</strong>: AI model and behavior defaults</li>
                      <li><strong>Billing</strong>: Subscription and payment management</li>
                      <li><strong>Adaptive Mode</strong>: Review AI proposals and Design Karma</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-purple-300">Improvements</h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Unified cosmic theme across all pages</li>
                      <li>Enhanced error handling and user feedback</li>
                      <li>Rate limit protection with cooldown periods</li>
                      <li>Comprehensive documentation system</li>
                      <li>Performance optimizations with Next.js 16</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-purple-300">Bug Fixes</h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Fixed proposal ID mismatch between UI and database</li>
                      <li>Resolved 406 errors in database queries</li>
                      <li>Fixed Supabase auth error handling</li>
                      <li>Corrected observability tracking for anonymous users</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <p className="text-sm text-purple-300 font-semibold mb-2">Future Releases</p>
                  <p className="text-sm text-muted-foreground">
                    Check the <Link href="/docs/roadmap" className="text-cyan-400 hover:underline">Roadmap</Link> to see what's coming next.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
