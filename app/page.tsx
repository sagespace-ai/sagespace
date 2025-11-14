import { Button } from '@/components/ui/button'
import { Sparkles, Zap, Users, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import ClientShell from '@/components/ClientShell'

export default function RootPage() {
  return (
    <ClientShell>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl font-bold tracking-tight sm:text-7xl bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
              Welcome to SageSpace
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Your cosmic journey through specialized AI wisdom. Experience the
              power of curated AI agents designed to elevate your creativity and
              productivity.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  Get Started
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button variant="outline" size="lg">
                  Try Demo
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Why SageSpace?
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<Sparkles className="h-8 w-8 text-purple-400" />}
                title="AI Sages"
                description="Access specialized AI agents curated for specific domains and use cases"
              />
              <FeatureCard
                icon={<Zap className="h-8 w-8 text-yellow-400" />}
                title="Lightning Fast"
                description="Powered by Groq for zero-cost, instant AI responses"
              />
              <FeatureCard
                icon={<Users className="h-8 w-8 text-blue-400" />}
                title="Council Mode"
                description="Get diverse perspectives from multiple AI agents working together"
              />
              <FeatureCard
                icon={<TrendingUp className="h-8 w-8 text-green-400" />}
                title="Design Karma"
                description="Earn points for good UX decisions and unlock premium features"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to explore?</h2>
            <p className="text-gray-300 mb-8">
              Join SageSpace and start your cosmic AI journey today
            </p>
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Create Account
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </ClientShell>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="relative p-6 rounded-lg border border-purple-500/20 bg-purple-950/10 backdrop-blur-sm hover:border-purple-500/40 transition-colors">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}
