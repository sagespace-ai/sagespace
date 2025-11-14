import { Metadata } from 'next'
import Link from 'next/link'
import { Book, Lightbulb, Code, HelpCircle, FileText, Sparkles } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Documentation - SageSpace',
  description: 'Learn how to use SageSpace and understand the platform architecture',
}

export default function DocsPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-cyan-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              SageSpace Documentation
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about the self-evolving AI universe
          </p>
        </div>

        {/* Main Docs Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {/* User Guide */}
          <Link href="/docs/user-guide">
            <Card className="h-full hover:border-purple-500/50 transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Book className="h-5 w-5 text-cyan-400" />
                  <CardTitle>User Guide</CardTitle>
                </div>
                <CardDescription>
                  Learn how to use SageSpace features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Getting started</li>
                  <li>Working with Sages</li>
                  <li>Adaptive system</li>
                  <li>Tips & best practices</li>
                </ul>
              </CardContent>
            </Card>
          </Link>

          {/* Success Criteria */}
          <Link href="/docs/success-criteria">
            <Card className="h-full hover:border-purple-500/50 transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-purple-400" />
                  <CardTitle>Success Criteria</CardTitle>
                </div>
                <CardDescription>
                  The DNA of the SageSpace platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Platform goals</li>
                  <li>Quality standards</li>
                  <li>Measurement criteria</li>
                  <li>Evolution protocol</li>
                </ul>
              </CardContent>
            </Card>
          </Link>

          {/* Technical Docs */}
          <Link href="/docs/technical">
            <Card className="h-full hover:border-purple-500/50 transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-pink-400" />
                  <CardTitle>Technical Docs</CardTitle>
                </div>
                <CardDescription>
                  Architecture and implementation details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>System architecture</li>
                  <li>AI orchestration</li>
                  <li>Database schema</li>
                  <li>API reference</li>
                </ul>
              </CardContent>
            </Card>
          </Link>

          {/* FAQ */}
          <Link href="/docs/faq">
            <Card className="h-full hover:border-purple-500/50 transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-cyan-400" />
                  <CardTitle>FAQ</CardTitle>
                </div>
                <CardDescription>
                  Frequently asked questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>General questions</li>
                  <li>Using Sages</li>
                  <li>Adaptive system</li>
                  <li>Troubleshooting</li>
                </ul>
              </CardContent>
            </Card>
          </Link>

          {/* Changelog */}
          <Link href="/docs/changelog">
            <Card className="h-full hover:border-purple-500/50 transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-400" />
                  <CardTitle>Changelog</CardTitle>
                </div>
                <CardDescription>
                  Platform updates and releases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Latest features</li>
                  <li>Bug fixes</li>
                  <li>Improvements</li>
                  <li>Breaking changes</li>
                </ul>
              </CardContent>
            </Card>
          </Link>

          {/* Roadmap */}
          <Link href="/docs/roadmap">
            <Card className="h-full hover:border-purple-500/50 transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-pink-400" />
                  <CardTitle>Roadmap</CardTitle>
                </div>
                <CardDescription>
                  What's coming next
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Upcoming features</li>
                  <li>Planned improvements</li>
                  <li>Community requests</li>
                  <li>Long-term vision</li>
                </ul>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="border-t border-purple-500/20 pt-8">
          <h2 className="text-2xl font-bold mb-4">Quick Links</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-2 text-cyan-400">For Users</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/docs/user-guide#getting-started" className="hover:text-cyan-400 transition-colors">Getting Started</Link></li>
                <li><Link href="/docs/user-guide#working-with-sages" className="hover:text-cyan-400 transition-colors">Working with Sages</Link></li>
                <li><Link href="/docs/user-guide#the-adaptive-system" className="hover:text-cyan-400 transition-colors">The Adaptive System</Link></li>
                <li><Link href="/docs/faq" className="hover:text-cyan-400 transition-colors">Common Questions</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-purple-400">For Developers</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/docs/technical#architecture-overview" className="hover:text-purple-400 transition-colors">Architecture Overview</Link></li>
                <li><Link href="/docs/technical#self-evolving-system" className="hover:text-purple-400 transition-colors">Self-Evolving System</Link></li>
                <li><Link href="/docs/technical#api-reference" className="hover:text-purple-400 transition-colors">API Reference</Link></li>
                <li><Link href="/docs/technical#contributing" className="hover:text-purple-400 transition-colors">Contributing Guide</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Need Help */}
        <div className="mt-12 text-center">
          <Card className="border-purple-500/20">
            <CardHeader>
              <CardTitle>Still need help?</CardTitle>
              <CardDescription>
                Can't find what you're looking for? We're here to help.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/settings">
                  <Button variant="outline" className="border-cyan-500/50 hover:bg-cyan-500/10">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Contact Support
                  </Button>
                </Link>
                <Button variant="outline" className="border-purple-500/50 hover:bg-purple-500/10">
                  <FileText className="mr-2 h-4 w-4" />
                  Request Feature
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
