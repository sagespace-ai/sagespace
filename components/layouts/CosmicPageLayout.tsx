import type { ReactNode } from 'react'

interface CosmicPageLayoutProps {
  children: ReactNode
  title?: string
  description?: string
  actions?: ReactNode
  className?: string
}

export function CosmicPageLayout({
  children,
  title,
  description,
  actions,
  className = ''
}: CosmicPageLayoutProps) {
  return (
    <div className={`min-h-screen px-4 py-8 md:px-8 md:py-12 ${className}`}>
      {(title || description || actions) && (
        <div className="max-w-7xl mx-auto mb-8 md:mb-12">
          <div className="flex items-start justify-between gap-4 mb-4">
            {title && (
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {title}
              </h1>
            )}
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
          {description && (
            <p className="text-lg text-slate-300 max-w-3xl">{description}</p>
          )}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  )
}

export function CosmicCenteredLayout({
  children,
  className = ''
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${className}`}>
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}

export function CosmicDashboardLayout({
  children,
  sidebar,
  header,
  className = ''
}: {
  children: ReactNode
  sidebar?: ReactNode
  header?: ReactNode
  className?: string
}) {
  return (
    <div className={`min-h-screen ${className}`}>
      {header && (
        <div className="sticky top-0 z-20 backdrop-blur-xl bg-black/50 border-b border-slate-800">
          <div className="px-4 py-4 md:px-8">
            {header}
          </div>
        </div>
      )}
      
      <div className="flex">
        {sidebar && (
          <aside className="hidden lg:block w-64 xl:w-80 border-r border-slate-800 min-h-screen sticky top-16">
            <div className="p-4">
              {sidebar}
            </div>
          </aside>
        )}
        
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
