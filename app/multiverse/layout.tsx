import { ErrorBoundary } from '@/components/error/ErrorBoundary'

export default function MultiverseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ErrorBoundary componentName="Multiverse">
      {children}
    </ErrorBoundary>
  )
}
