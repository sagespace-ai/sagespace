import { ErrorBoundary } from '@/components/error/ErrorBoundary'

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ErrorBoundary componentName="Playground">
      {children}
    </ErrorBoundary>
  )
}
