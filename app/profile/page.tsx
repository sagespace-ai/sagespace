import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Genesis Chamber | SageSpace',
  description: 'Your personal journey through the SageSpace universe',
}

export default async function ProfilePage() {
  try {
    const supabase = await createServerClient()
    
    const { data: { user }, error } = await supabase.auth.getUser()
    
    // If there's an error or no user, redirect to login
    if (error || !user) {
      redirect('/auth/login?redirect=/profile')
    }
    
    // Redirect to Genesis Chamber
    redirect('/genesis')
  } catch (error) {
    // If Supabase fails entirely, redirect to login
    console.error('[v0] Profile page auth error:', error)
    redirect('/auth/login?redirect=/profile')
  }
}
