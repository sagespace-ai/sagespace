import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Genesis Chamber | SageSpace',
  description: 'Your personal journey through the SageSpace universe',
}

export default async function ProfilePage() {
  const supabase = await createServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login?redirect=/profile')
  }
  
  // Redirect to Genesis Chamber
  redirect('/genesis')
}
