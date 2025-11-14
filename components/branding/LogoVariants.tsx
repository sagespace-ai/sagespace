import { AnimatedLogo } from "./AnimatedLogo"

// Pre-configured logo variants for common use cases

export function NavLogo() {
  return <AnimatedLogo size="sm" showText={true} animate={true} />
}

export function HeroLogo() {
  return <AnimatedLogo size="xl" showText={false} variant="icon-only" animate={true} />
}

export function FaviconLogo() {
  return <AnimatedLogo size="sm" showText={false} variant="icon-only" animate={false} />
}

export function FooterLogo() {
  return <AnimatedLogo size="md" showText={true} animate={false} />
}

export function SplashLogo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <AnimatedLogo size="xl" showText={false} variant="icon-only" animate={true} />
      <AnimatedLogo size="lg" showText={true} variant="text-only" animate={true} />
    </div>
  )
}
