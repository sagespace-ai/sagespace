import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'FAQ - SageSpace',
  description: 'Frequently asked questions',
}

export default function FAQPage() {
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
              <HelpCircle className="h-8 w-8 text-cyan-400" />
              <h1 className="text-4xl font-bold m-0 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Frequently Asked Questions
              </h1>
            </div>
            
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4 text-cyan-400">General</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-purple-300">What is SageSpace?</h3>
                    <p className="text-muted-foreground">
                      SageSpace is a self-evolving AI platform where you interact with specialized AI agents called Sages. 
                      The platform learns from your behavior and suggests improvements, but you always stay in control.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-purple-300">Is it free?</h3>
                    <p className="text-muted-foreground">
                      SageSpace offers both free and premium tiers. The free tier includes basic access to Sages and core features. 
                      Premium unlocks advanced features, priority access, and more.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-purple-300">How is my data used?</h3>
                    <p className="text-muted-foreground">
                      Your data is used only to personalize your experience. We track usage patterns to generate UX improvements, 
                      but all data stays within your account. We never sell your data or use it to train external AI models.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-cyan-400">Using Sages</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-purple-300">What are Sages?</h3>
                    <p className="text-muted-foreground">
                      Sages are specialized AI agents, each expert in a specific domain like creative writing, data analysis, 
                      or philosophical debate. They stay within their expertise boundaries to give you accurate, reliable answers.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-purple-300">Can I create my own Sage?</h3>
                    <p className="text-muted-foreground">
                      Currently, Sages are curated by the SageSpace team to ensure quality and expertise. 
                      Custom Sage creation is on the roadmap for future releases.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-purple-300">What's the Council feature?</h3>
                    <p className="text-muted-foreground">
                      Council brings together 3-5 Sages to deliberate on your question together. You get diverse perspectives 
                      and a synthesized answer that considers multiple viewpoints.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-cyan-400">Adaptive System</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-purple-300">What is the Dreamer AI?</h3>
                    <p className="text-muted-foreground">
                      The Dreamer is an AI system that observes how you use SageSpace, identifies patterns and friction points, 
                      then generates UX improvement proposals for you to review.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-purple-300">Do changes happen automatically?</h3>
                    <p className="text-muted-foreground">
                      No. All AI-generated proposals require your explicit approval. You review each suggestion, see the reasoning, 
                      and decide whether to apply it. You're always in control.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-purple-300">Where do I see proposals?</h3>
                    <p className="text-muted-foreground">
                      Go to Settings → Adaptive Mode. There you'll see pending proposals with full details, expected benefits, 
                      and AI reasoning. You can approve or reject each one.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-purple-300">What is Design Karma?</h3>
                    <p className="text-muted-foreground">
                      Design Karma is a gamification system that rewards you for reviewing proposals. Earn points, level up your 
                      Architect status, and build review streaks as you help shape the platform.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-cyan-400">Troubleshooting</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-purple-300">Sage isn't responding</h3>
                    <p className="text-muted-foreground">
                      Check your internet connection and refresh the page. If the issue persists, the AI service might be temporarily unavailable. 
                      Try again in a few moments or contact support.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-purple-300">I got a "Too many requests" error</h3>
                    <p className="text-muted-foreground">
                      This means you've hit the rate limit. Wait a moment (usually 30 seconds) and try again. 
                      The system enforces rate limits to ensure fair usage and stability.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-purple-300">My conversation disappeared</h3>
                    <p className="text-muted-foreground">
                      Conversations are automatically saved. Check the Memory page to find all your past sessions. 
                      Use the search function to find specific conversations.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-cyan-400">Still need help?</h2>
                <p className="text-muted-foreground mb-4">
                  Can't find the answer you're looking for? We're here to help.
                </p>
                <Link href="/settings">
                  <Button variant="outline" className="border-cyan-500/50 hover:bg-cyan-500/10">
                    Contact Support
                  </Button>
                </Link>
              </section>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
