"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Zap, Crown, Sparkles, Loader2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { XP_PACKS, SAGEPOINTS_PACKS, type StoreItem } from '@/config/store-items'

export function StorePageClient() {
  const router = useRouter()
  const { toast } = useToast()
  const [purchasing, setPurchasing] = useState<string | null>(null)

  async function handlePurchase(item: StoreItem) {
    setPurchasing(item.id)
    try {
      const res = await fetch('/api/store/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: item.id,
          itemType: item.type,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error)
      }

      const data = await res.json()

      toast({
        title: 'Purchase Successful!',
        description: item.type === 'XP_PACK' 
          ? `Added ${data.added} XP. New total: ${data.newTotal} XP`
          : `Added ${data.added} SagePoints. New total: ${data.newTotal} SagePoints`,
      })
    } catch (error: any) {
      console.error('[v0] Error purchasing item:', error)
      toast({
        title: 'Purchase Failed',
        description: error.message || 'Failed to complete purchase',
        variant: 'destructive',
      })
    } finally {
      setPurchasing(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="mb-4 hover:bg-purple-500/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Cosmic Store
            </h1>
            <p className="text-slate-300 text-lg">
              Boost your journey with XP packs and SagePoints for premium sessions
            </p>
          </div>
        </div>

        <Tabs defaultValue="xp" className="space-y-6">
          <TabsList className="bg-slate-900/50 border border-purple-500/20">
            <TabsTrigger value="xp" className="data-[state=active]:bg-purple-600/20">
              <Zap className="mr-2 h-4 w-4" />
              XP Boosts
            </TabsTrigger>
            <TabsTrigger value="sagepoints" className="data-[state=active]:bg-cyan-600/20">
              <Crown className="mr-2 h-4 w-4" />
              SagePoints
            </TabsTrigger>
          </TabsList>

          <TabsContent value="xp" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {XP_PACKS.map((pack) => (
                <Card 
                  key={pack.id}
                  className={`bg-slate-900/50 border-purple-500/20 hover:border-purple-400/40 transition-all relative ${
                    pack.popular ? 'ring-2 ring-purple-500' : ''
                  }`}
                >
                  {pack.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <div className="px-3 py-1 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full text-xs font-semibold">
                        Best Value
                      </div>
                    </div>
                  )}

                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-amber-600 to-orange-600">
                        <Zap className="h-6 w-6 text-white" />
                      </div>
                      {pack.bonus && (
                        <div className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-400/30">
                          +{pack.bonus}% Bonus
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-2xl">{pack.name}</CardTitle>
                    <CardDescription className="text-slate-400">
                      {pack.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold text-amber-400">
                          {pack.bonus ? Math.floor(pack.value * (1 + pack.bonus / 100)).toLocaleString() : pack.value.toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-400">XP Points</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">${(pack.priceCents / 100).toFixed(2)}</div>
                      </div>
                    </div>

                    <Button
                      onClick={() => handlePurchase(pack)}
                      disabled={purchasing === pack.id}
                      className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500"
                    >
                      {purchasing === pack.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          Purchase
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-slate-900/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-400" />
                  About XP Boosts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-slate-300">
                <p>XP boosts instantly add experience points to your profile, helping you:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Level up faster and unlock new tiers</li>
                  <li>Access exclusive features and Sages</li>
                  <li>Show off your cosmic mastery</li>
                  <li>Compete on the leaderboard</li>
                </ul>
                <p className="text-xs text-slate-400 mt-4">
                  Bulk packs include bonus XP for better value!
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sagepoints" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              {SAGEPOINTS_PACKS.map((pack) => (
                <Card 
                  key={pack.id}
                  className={`bg-slate-900/50 border-cyan-500/20 hover:border-cyan-400/40 transition-all relative ${
                    pack.popular ? 'ring-2 ring-cyan-500' : ''
                  }`}
                >
                  {pack.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <div className="px-3 py-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full text-xs font-semibold">
                        Best Value
                      </div>
                    </div>
                  )}

                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-600">
                        <Crown className="h-6 w-6 text-white" />
                      </div>
                      {pack.bonus && (
                        <div className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-400/30">
                          +{pack.bonus}% Bonus
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-2xl">{pack.name}</CardTitle>
                    <CardDescription className="text-slate-400">
                      {pack.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold text-cyan-400">
                          {pack.bonus ? Math.floor(pack.value * (1 + pack.bonus / 100)) : pack.value}
                        </div>
                        <div className="text-xs text-slate-400">SagePoints</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">${(pack.priceCents / 100).toFixed(2)}</div>
                      </div>
                    </div>

                    <Button
                      onClick={() => handlePurchase(pack)}
                      disabled={purchasing === pack.id}
                      className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
                    >
                      {purchasing === pack.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          Purchase
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-slate-900/50 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-cyan-400" />
                  About SagePoints
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-slate-300">
                <p>SagePoints are your closed-loop in-app utility credits for premium features:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Deep analysis with 6+ Sages simultaneously in Council</li>
                  <li>Extended reasoning chains and consensus building</li>
                  <li>Priority processing and faster responses</li>
                  <li>Full transcript exports and audit trails</li>
                </ul>
                <p className="text-xs text-slate-400 mt-4">
                  SagePoints never expire. Bulk packs include bonus points!
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
