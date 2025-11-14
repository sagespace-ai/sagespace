import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'SageSpace Passport | Your Journey Hub',
  description: 'Your gamified identity and progress hub in the SageSpace universe',
}

export default function PassportPage() {
  redirect('/profile')
}
