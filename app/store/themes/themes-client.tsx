"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Check, Lock, Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

interface Theme {
  id: string;
  name: string;
  description: string;
  tier: string | null;
  is_premium: boolean;
  price_cents: number;
  config: {
    background: string;
    accent: string;
  };
  owned: boolean;
}

export function ThemesPageClient() {
  const router = useRouter()
  const { toast } = useToast()
  const [themes, setThemes] = useState<Theme[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [purchasing, setPurchasing] = useState<string | null>(null)

  useEffect(() => {
    loadThemes()
  }, [])

  async function loadThemes() {
    try {
      const res = await fetch('/api/themes')
      const data = await res.json()
      setThemes(data.themes)
    } catch (error) {
      console.error('[v0] Error loading themes:', error)
      toast({
        title: 'Error',
        description: 'Failed to load themes',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handlePurchase(themeId: string) {
    setPurchasing(themeId)
    try {
      const res = await fetch('/api/themes/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ themeId }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error)
      }

      toast({
        title: 'Theme Unlocked!',
        description: 'Your new theme is now available',
      })
      
      await loadThemes()
    } catch (error: any) {
      console.error('[v0] Error purchasing theme:', error)
      toast({
        title: 'Purchase Failed',
        description: error.message || 'Failed to unlock theme',
        variant: 'destructive',
      })
    } finally {
      setPurchasing(null)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
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
              Cosmic Theme Store
            </h1>
            <p className="text-slate-300 text-lg">
              Personalize your SageSpace experience with premium themes
            </p>
          </div>
        </div>

        {/* Theme Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {themes.map((theme) => (
            <Card 
              key={theme.id}
              className="bg-slate-900/50 border-purple-500/20 hover:border-purple-400/40 transition-all overflow-hidden"
            >
              {/* Theme Preview */}
              <div className={`h-32 bg-gradient-to-br ${theme.config.background} relative`}>
                <div className={`absolute inset-0 flex items-center justify-center`}>
                  <Sparkles className={`h-12 w-12 bg-gradient-to-r ${theme.config.accent} bg-clip-text text-transparent`} />
                </div>
                {theme.owned && (
                  <div className="absolute top-2 right-2 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-400/30 flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    Owned
                  </div>
                )}
                {theme.tier && !theme.owned && (
                  <div className="absolute top-2 right-2 px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full border border-amber-400/30 flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    {theme.tier}
                  </div>
                )}
              </div>

              <CardHeader>
                <CardTitle className="text-xl">{theme.name}</CardTitle>
                <CardDescription className="text-slate-400">
                  {theme.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    {theme.price_cents === 0 ? (
                      <span className="text-2xl font-bold text-green-400">Free</span>
                    ) : (
                      <span className="text-2xl font-bold">${(theme.price_cents / 100).toFixed(2)}</span>
                    )}
                  </div>
                  
                  <Button
                    onClick={() => handlePurchase(theme.id)}
                    disabled={theme.owned || purchasing === theme.id}
                    className={
                      theme.owned
                        ? 'bg-green-600/50 cursor-default'
                        : 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500'
                    }
                  >
                    {purchasing === theme.id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Unlocking...
                      </>
                    ) : theme.owned ? (
                      'Owned'
                    ) : (
                      'Unlock'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
