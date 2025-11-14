"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Sparkles, ShoppingBag, Lock, Check, ArrowLeft, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GENESIS_UNLOCKS, canPurchaseUnlock, type GenesisUnlock } from '@/config/genesis-unlocks'
import { useSubscription } from '@/lib/hooks/use-subscription'
import { useToast } from '@/hooks/use-toast'

export function GenesisStoreClient() {
  const router = useRouter()
  const { toast } = useToast()
  const { subscription } = useSubscription()
  const [loading, setLoading] = useState(false)
  const [purchasedIds, setPurchasedIds] = useState<string[]>([])

  const userTier = subscription?.tier || 'explorer'

  const handlePurchase = async (unlock: GenesisUnlock) => {
    if (!canPurchaseUnlock(unlock, userTier)) {
      toast({
        title: 'Upgrade Required',
        description: `This unlock requires ${unlock.minTier} tier or higher`,
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/genesis/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unlockId: unlock.id })
      })

      if (!res.ok) throw new Error('Purchase failed')

      const data = await res.json()
      
      setPurchasedIds(prev => [...prev, unlock.id])
      
      toast({
        title: 'Purchase Successful!',
        description: `${unlock.name} unlocked! ${data.bonusXP > 0 ? `+${data.bonusXP} XP added` : ''}`
      })
    } catch (error) {
      toast({
        title: 'Purchase Failed',
        description: 'Please try again later',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const UnlockCard = ({ unlock }: { unlock: GenesisUnlock }) => {
    const canPurchase = canPurchaseUnlock(unlock, userTier)
    const isPurchased = purchasedIds.includes(unlock.id)

    return (
      <Card className="bg-slate-900/50 border-purple-500/20 hover:border-purple-500/40 transition-all">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="text-4xl mb-2">{unlock.icon}</div>
            {!canPurchase && (
              <Badge variant="outline" className="border-yellow-500/50 text-yellow-400">
                <Crown className="w-3 h-3 mr-1" />
                {unlock.minTier}
              </Badge>
            )}
            {isPurchased && (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                <Check className="w-3 h-3 mr-1" />
                Owned
              </Badge>
            )}
          </div>
          <CardTitle className="text-xl">{unlock.name}</CardTitle>
          <CardDescription>{unlock.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="space-y-1">
              {unlock.benefits.map((benefit, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-bold text-white">${unlock.price.toFixed(2)}</span>
              </div>

              <Button
                onClick={() => handlePurchase(unlock)}
                disabled={loading || !canPurchase || isPurchased}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
              >
                {isPurchased ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Purchased
                  </>
                ) : !canPurchase ? (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Requires {unlock.minTier}
                  </>
                ) : (
                  <>
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Purchase
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
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
            onClick={() => router.push('/genesis')}
            className="mb-4 text-slate-400 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Genesis Chamber
          </Button>

          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 flex items-center gap-3">
            <ShoppingBag className="h-10 w-10 text-purple-400" />
            Genesis Store
          </h1>
          <p className="text-slate-400 text-lg">
            Unlock premium companions, achievements, and quests
          </p>
        </motion.div>

        <Tabs defaultValue="companions" className="space-y-6">
          <TabsList className="bg-slate-900/50 border border-purple-500/20">
            <TabsTrigger value="companions">Companions</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="quests">Quests</TabsTrigger>
            <TabsTrigger value="sages">Sage Collections</TabsTrigger>
          </TabsList>

          <TabsContent value="companions" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {GENESIS_UNLOCKS.filter(u => u.type === 'companion_pack').map(unlock => (
                <UnlockCard key={unlock.id} unlock={unlock} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {GENESIS_UNLOCKS.filter(u => u.type === 'achievement_pack').map(unlock => (
                <UnlockCard key={unlock.id} unlock={unlock} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="quests" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {GENESIS_UNLOCKS.filter(u => u.type === 'quest_bundle').map(unlock => (
                <UnlockCard key={unlock.id} unlock={unlock} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sages" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {GENESIS_UNLOCKS.filter(u => u.type === 'sage_collection').map(unlock => (
                <UnlockCard key={unlock.id} unlock={unlock} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
