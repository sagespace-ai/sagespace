import Link from "next/link"
import { Users, ShieldCheck, Zap, BarChart3, Settings, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: Users,
    title: "Multi-Agent Collaboration",
    description:
      "Deploy specialized agents that work together, each contributing their unique expertise to complex tasks",
  },
  {
    icon: ShieldCheck,
    title: "Human-in-the-Loop",
    description: "Critical decisions require human approval, ensuring ethical alignment and maintaining control",
  },
  {
    icon: Zap,
    title: "Real-time Insights",
    description: "Monitor agent performance, track collaboration metrics, and audit every decision in real-time",
  },
  {
    icon: BarChart3,
    title: "Performance Tracking",
    description: "Analytics dashboard shows harmony scores, ethics alignment, and task completion rates",
  },
  {
    icon: Settings,
    title: "Flexible Configuration",
    description: "Customize agent roles, approval workflows, and collaboration patterns to fit your needs",
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description: "Row-level security, audit logs, and policy enforcement ensure your data stays protected",
  },
]

const steps = [
  {
    number: 1,
    title: "Create Your Agent Team",
    description: "Choose from our marketplace or create custom agents with specific roles, expertise, and purposes",
  },
  {
    number: 2,
    title: "Set Collaboration Rules",
    description: "Define which agents work together, approval thresholds, and decision-making workflows",
  },
  {
    number: 3,
    title: "Deploy and Monitor",
    description: "Watch your agents collaborate in real-time with full transparency and human oversight",
  },
]

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-primary" />
              <span className="text-xl font-bold bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
                SageSpace
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-text-secondary hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm text-text-secondary hover:text-foreground transition-colors">
                How It Works
              </a>
              <a href="#agents" className="text-sm text-text-secondary hover:text-foreground transition-colors">
                Agents
              </a>
              <Link href="/demo" className="text-sm text-text-secondary hover:text-foreground transition-colors">
                Demo
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-primary/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-sm font-medium text-accent">Multi-Agent AI Platform</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="text-foreground">Where AI Agents Collaborate</span>
              <br />
              <span className="bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
                With Human Wisdom
              </span>
            </h1>

            <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
              Deploy specialized AI agents that work together seamlessly, with human oversight ensuring ethical
              alignment and optimal decision-making at every step.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90 px-8">
                  Start Building
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="px-8 bg-transparent">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-card/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Built for Complex Workflows</h2>
            <p className="text-xl text-text-secondary">
              SageSpace combines the power of multiple AI agents with human oversight for unparalleled results
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass rounded-2xl p-6 border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-text-secondary leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How SageSpace Works</h2>
            <p className="text-xl text-text-secondary">
              A simple, powerful workflow that combines AI efficiency with human wisdom
            </p>
          </div>

          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-8 items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-background font-bold text-lg">
                    {step.number}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                  <p className="text-text-secondary text-lg leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-accent to-primary text-background hover:opacity-90 px-8"
              >
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-card/40 to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to architect your universe?</h2>
          <p className="text-xl text-text-secondary mb-8">
            Experience the Five Laws in action. Build, govern, and collaborate with your intelligent agents in
            real-time.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90 px-8">
              Enter
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-accent to-primary" />
              <span className="font-bold bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
                SageSpace
              </span>
            </div>
            <p className="text-sm text-text-secondary">Multi-Agent AI Collaboration Platform</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
