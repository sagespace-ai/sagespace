import { ErrorBoundary } from '@/components/error/ErrorBoundary'

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ErrorBoundary componentName="Settings">
      {children}
    </ErrorBoundary>
  )
}
