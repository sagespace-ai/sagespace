import { ErrorBoundary } from '@/components/error/ErrorBoundary'

export default function CouncilLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ErrorBoundary componentName="Council">
      {children}
    </ErrorBoundary>
  )
}
