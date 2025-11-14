"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { DollarSign, TrendingUp, ShoppingCart, Zap, Calendar, Download, ArrowLeft, CreditCard, Package, BarChart3, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSubscription } from '@/lib/hooks/use-subscription'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface BillingAnalytics {
  subscription: any
  purchases: {
    themes: any[]
    genesis: any[]
    total: number
  }
  spending: {
    totalLifetime: number
    thisMonth: number
    subscriptionValue: number
    oneTimePurchases: number
  }
  usage: {
    last30Days: {
      interactions: number
      sageChats: number
      councilSessions: number
    }
  }
}

export function BillingDashboardClient() {
  const router = useRouter()
  const { subscription } = useSubscription()
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<BillingAnalytics | null>(null)

  useEffect(() => {
    loadAnalytics()
  }, [])

  async function loadAnalytics() {
    try {
      const res = await fetch('/api/billing/analytics')
      if (res.ok) {
        const data = await res.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/settings')}
            className="mb-4 text-slate-400 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Settings
          </Button>

          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 flex items-center gap-3">
            <DollarSign className="h-10 w-10 text-purple-400" />
            Billing & Analytics
          </h1>
          <p className="text-slate-400 text-lg">
            Complete visibility into your spending and usage
          </p>
        </motion.div>

        {/* Overview Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="bg-slate-900/50 border-purple-500/20">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Lifetime Spending
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                ${analytics?.spending.totalLifetime.toFixed(2)}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Since you joined
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-purple-500/20">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                This Month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                ${analytics?.spending.thisMonth.toFixed(2)}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Current billing cycle
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-purple-500/20">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Total Purchases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {analytics?.purchases.total}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Themes & unlocks
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-purple-500/20">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Usage (30d)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {analytics?.usage.last30Days.interactions}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Total interactions
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-slate-900/50 border border-purple-500/20">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="purchases">Purchase History</TabsTrigger>
            <TabsTrigger value="usage">Usage Analytics</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="bg-slate-900/50 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-cyan-400" />
                    Spending Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Subscription</span>
                    <span className="font-bold">${analytics?.spending.subscriptionValue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">One-time Purchases</span>
                    <span className="font-bold">${analytics?.spending.oneTimePurchases.toFixed(2)}</span>
                  </div>
                  <div className="pt-4 border-t border-slate-700">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-semibold">Total</span>
                      <span className="font-bold text-lg">${analytics?.spending.totalLifetime.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                    Value Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert className="bg-green-500/10 border-green-500/20">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                    <AlertDescription className="text-green-300">
                      You've had {analytics?.usage.last30Days.interactions} interactions this month. 
                      That's ${(analytics?.spending.thisMonth / (analytics?.usage.last30Days.interactions || 1)).toFixed(2)} per interaction!
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Sage Chats</span>
                      <span className="text-white">{analytics?.usage.last30Days.sageChats}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Council Sessions</span>
                      <span className="text-white">{analytics?.usage.last30Days.councilSessions}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="purchases" className="space-y-6">
            <Card className="bg-slate-900/50 border-purple-500/20">
              <CardHeader>
                <CardTitle>Purchase History</CardTitle>
                <CardDescription>All your themes and Genesis unlocks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics?.purchases.genesis.length === 0 && analytics?.purchases.themes.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 mx-auto text-slate-600 mb-3" />
                      <p className="text-slate-400">No purchases yet</p>
                      <Button
                        onClick={() => router.push('/store')}
                        className="mt-4 bg-gradient-to-r from-purple-600 to-cyan-600"
                      >
                        Browse Store
                      </Button>
                    </div>
                  ) : (
                    <>
                      {analytics?.purchases.genesis.map((purchase: any) => (
                        <div
                          key={purchase.id}
                          className="flex items-center justify-between p-4 rounded-lg bg-black/30 border border-purple-500/20"
                        >
                          <div>
                            <h4 className="font-semibold text-white">{purchase.unlock_id}</h4>
                            <p className="text-sm text-slate-400">
                              {new Date(purchase.purchased_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant="outline" className="border-green-500/50 text-green-400">
                            ${purchase.price_paid}
                          </Badge>
                        </div>
                      ))}

                      {analytics?.purchases.themes.map((theme: any) => (
                        <div
                          key={theme.theme_id}
                          className="flex items-center justify-between p-4 rounded-lg bg-black/30 border border-purple-500/20"
                        >
                          <div>
                            <h4 className="font-semibold text-white">Theme: {theme.theme_id}</h4>
                            <p className="text-sm text-slate-400">
                              {new Date(theme.purchased_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant="outline" className="border-green-500/50 text-green-400">
                            $4.99
                          </Badge>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usage" className="space-y-6">
            <Card className="bg-slate-900/50 border-purple-500/20">
              <CardHeader>
                <CardTitle>Usage Analytics (Last 30 Days)</CardTitle>
                <CardDescription>See how you're using SageSpace</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Total Interactions</span>
                      <span className="font-bold text-2xl">{analytics?.usage.last30Days.interactions}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Sage Conversations</span>
                      <span className="font-bold text-xl">{analytics?.usage.last30Days.sageChats}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Council Sessions</span>
                      <span className="font-bold text-xl">{analytics?.usage.last30Days.councilSessions}</span>
                    </div>
                  </div>

                  <Alert className="bg-cyan-500/10 border-cyan-500/20">
                    <AlertCircle className="h-4 w-4 text-cyan-400" />
                    <AlertDescription className="text-cyan-300">
                      {analytics?.usage.last30Days.interactions > 100
                        ? "You're a power user! Consider upgrading for unlimited access."
                        : "Great start! Keep exploring SageSpace to unlock more features."
                      }
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscription" className="space-y-6">
            <Card className="bg-slate-900/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-purple-400" />
                  Subscription Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Current Plan</span>
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50">
                    {analytics?.subscription?.tier || 'Explorer'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Status</span>
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
                    Active
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">SagePoints Balance</span>
                  <span className="font-bold">{analytics?.subscription?.sage_points || 0}</span>
                </div>

                <div className="pt-4 space-y-2">
                  <Button
                    onClick={() => router.push('/subscriptions')}
                    className="w-full bg-gradient-to-r from-purple-600 to-cyan-600"
                  >
                    Manage Subscription
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-slate-600"
                    onClick={() => {
                      // Export data as CSV
                      const csv = `Type,Amount,Date\n${analytics?.purchases.genesis.map((p: any) => 
                        `Genesis,${p.price_paid},${p.purchased_at}`
                      ).join('\n')}`
                      const blob = new Blob([csv], { type: 'text/csv' })
                      const url = window.URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = 'sagespace-purchases.csv'
                      a.click()
                    }}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
