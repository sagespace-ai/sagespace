import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { SubscriptionsPageClient } from './subscriptions-client'

export const metadata: Metadata = {
  title: 'Subscriptions | SageSpace',
  description: 'Manage your SageSpace subscription and billing',
}

export default async function SubscriptionsPage() {
  const supabase = await createServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login?redirect=/subscriptions')
  }
  
  return <SubscriptionsPageClient />
}
