import { ErrorBoundary } from '@/components/error/ErrorBoundary'

export default function PersonaEditorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ErrorBoundary componentName="Studio">
      {children}
    </ErrorBoundary>
  )
}
