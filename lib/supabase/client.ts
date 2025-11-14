import { createBrowserClient } from "@supabase/ssr"

let clientInstance: ReturnType<typeof createBrowserClient> | null = null
let isInitializing = false

export function createClient() {
  if (typeof window === 'undefined') {
    throw new Error('createBrowserClient can only be used in browser context')
  }

  if (clientInstance) {
    return clientInstance
  }

  if (isInitializing) {
    throw new Error('Supabase client is already being initialized')
  }

  isInitializing = true

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  if (!supabaseUrl || !supabaseAnonKey) {
    isInitializing = false
    throw new Error('Missing Supabase environment variables')
  }

  clientInstance = createBrowserClient(supabaseUrl, supabaseAnonKey, {
    isSingleton: true,
  })

  isInitializing = false

  return clientInstance
}

export { createClient as createBrowserClient }
