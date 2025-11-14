import { createServerClient } from '@/lib/supabase/server'
import MarketingPage from './(marketing)/page'

export default async function HomePage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If user is authenticated, redirect to Hub
  if (user) {
    return (
      <>
        <script dangerouslySetInnerHTML={{ __html: `window.location.href = '/demo'` }} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            <p className="text-slate-400">Redirecting to Hub...</p>
          </div>
        </div>
      </>
    )
  }

  // Otherwise, show marketing page
  return <MarketingPage />
}
