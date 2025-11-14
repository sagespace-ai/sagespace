import { BillingDashboardClient } from './billing-client'

export const metadata = {
  title: 'Billing & Analytics | SageSpace',
  description: 'Manage your billing and view usage analytics'
}

export default function BillingPage() {
  return <BillingDashboardClient />
}
