import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { readFileSync } from 'fs'
import { join } from 'path'

export const metadata: Metadata = {
  title: 'Success Criteria - SageSpace',
  description: 'The DNA of the SageSpace platform',
}

export default async function SuccessCriteriaPage() {
  // Read the success criteria markdown file
  let content = ''
  try {
    content = readFileSync(join(process.cwd(), 'docs', 'SUCCESS_CRITERIA.md'), 'utf-8')
  } catch (error) {
    console.log('[v0] Could not read SUCCESS_CRITERIA.md')
  }

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
              <CheckCircle2 className="h-8 w-8 text-cyan-400" />
              <h1 className="text-4xl font-bold m-0 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Success Criteria
              </h1>
            </div>
            <p className="text-muted-foreground mb-8">
              The DNA of the SageSpace platform - measurable standards that guide every decision and evolution.
            </p>
            
            {content ? (
              <div className="whitespace-pre-wrap text-muted-foreground">
                {content}
              </div>
            ) : (
              <div className="space-y-6">
                <section>
                  <h2 className="text-2xl font-bold mb-3 text-cyan-400">Overview</h2>
                  <p className="text-muted-foreground">
                    SageSpace operates on 12 measurable success criteria that ensure quality, stability, and continuous evolution.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-3 text-cyan-400">Core Principles</h2>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li><strong>Stability First</strong>: No breaking changes, graceful error handling</li>
                    <li><strong>Human in the Loop</strong>: AI proposes, humans approve</li>
                    <li><strong>Governance Over Freedom</strong>: 10 strict safety policies filter all proposals</li>
                    <li><strong>Performance Matters</strong>: Fast responses, optimized queries</li>
                    <li><strong>Documentation as Code</strong>: Keep docs in sync with platform</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-3 text-cyan-400">Success Metrics</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-purple-300">1. Stability</h3>
                      <p className="text-muted-foreground">All routes functional, no 404s, error handling in place</p>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-purple-300">2. UX Consistency</h3>
                      <p className="text-muted-foreground">Cosmic theme globally applied, unified navigation</p>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-purple-300">3. Feature Completeness</h3>
                      <p className="text-muted-foreground">All 10 core features working end-to-end</p>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-purple-300">4. AI Architecture</h3>
                      <p className="text-muted-foreground">LangGraph orchestration, error recovery, streaming</p>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-purple-300">5. Personalization System</h3>
                      <p className="text-muted-foreground">Observability tracking, AI Dreamer generating proposals</p>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-purple-300">6. Governance Layer</h3>
                      <p className="text-muted-foreground">10 safety policies filtering all AI proposals</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-3 text-cyan-400">Evolution Protocol</h2>
                  <p className="text-muted-foreground mb-4">
                    Every build and human-AI interaction should gravitate us closer to these criteria. 
                    New features are only added after contemplating necessity and alignment.
                  </p>
                  
                  <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <p className="text-sm text-purple-300 font-semibold mb-2">Living Document</p>
                    <p className="text-sm text-muted-foreground">
                      This success criteria evolves with the platform. When we discover new requirements or 
                      standards, they're added here first before implementation.
                    </p>
                  </div>
                </section>
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  )
}
