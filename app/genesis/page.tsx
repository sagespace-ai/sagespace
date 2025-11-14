import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { GenesisClient } from './genesis-client'

export const metadata: Metadata = {
  title: 'Genesis Chamber | SageSpace',
  description: 'Awaken your journey through the sage universe',
}

export default async function GenesisPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login?redirect=/genesis')
  }
  
  return <GenesisClient />
}
