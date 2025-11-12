import { UniverseShowcase } from "@/components/universe-showcase"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { EyeIcon as Eye, ScaleIcon as Scale } from "@/components/icons"

export const metadata = {
  title: "SageSpace Universe",
  description: "Your personal universe of intelligent agents",
}

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-background text-text overflow-hidden">
      {/* Ambient background effect */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      </div>

      <div className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold">SageSpace Universe</h1>
          <div className="flex gap-2">
            <Link href="/observatory">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Eye className="w-4 h-4" />
                Observatory
              </Button>
            </Link>
            <Link href="/council">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Scale className="w-4 h-4" />
                Council
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <UniverseShowcase />
    </main>
  )
}
