import { ErrorBoundary } from '@/components/error/ErrorBoundary'

export default function MemoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ErrorBoundary componentName="Memory">
      {children}
    </ErrorBoundary>
  )
}
