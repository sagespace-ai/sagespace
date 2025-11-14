'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DollarSign, Download, Package, TrendingUp, Plus, Edit, Trash2 } from 'lucide-react'
import { MARKETPLACE_CONFIG, CREATOR_TIERS } from '@/config/marketplace'

interface Creator {
  id: string
  display_name: string
  bio: string
  commission_rate: number
  total_sales: number
  total_earnings: number
  is_verified: boolean
}

interface Product {
  id: string
  product_name: string
  category: string
  price_usd: number
  downloads_count: number
  is_active: boolean
}

export default function CreatorDashboardClient() {
  const [creator, setCreator] = useState<Creator | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    fetchCreatorData()
  }, [])

  const fetchCreatorData = async () => {
    try {
      setLoading(true)
      
      const creatorRes = await fetch('/api/marketplace/creators/me')
      const creatorData = await creatorRes.json()
      
      if (!creatorData.creator) {
        setShowOnboarding(true)
      } else {
        setCreator(creatorData.creator)
        
        const productsRes = await fetch(`/api/marketplace/products?creatorId=${creatorData.creator.id}`)
        const productsData = await productsRes.json()
        setProducts(productsData.products || [])
      }
    } catch (error) {
      console.error('Error fetching creator data:', error)
    } finally {
      setLoading(false)
    }
  }

  const createCreatorProfile = async (displayName: string, bio: string) => {
    try {
      const response = await fetch('/api/marketplace/creators/me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName, bio })
      })

      if (response.ok) {
        fetchCreatorData()
        setShowOnboarding(false)
      }
    } catch (error) {
      console.error('Error creating creator profile:', error)
    }
  }

  const getCurrentTier = () => {
    if (!creator) return CREATOR_TIERS.starter
    if (creator.total_sales >= CREATOR_TIERS.premium.minSales) return CREATOR_TIERS.premium
    if (creator.total_sales >= CREATOR_TIERS.established.minSales) return CREATOR_TIERS.established
    return CREATOR_TIERS.starter
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><div className="text-white">Loading...</div></div>
  }

  if (showOnboarding) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <Card className="cosmic-card p-8">
          <h1 className="text-3xl font-bold text-white mb-4">Become a Creator</h1>
          <p className="text-slate-300 mb-6">
            Join the SageSpace creator community and share your cosmic creations with thousands of users. Earn {MARKETPLACE_CONFIG.minCommissionRate}-{MARKETPLACE_CONFIG.maxCommissionRate}% on every sale.
          </p>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Display Name</label>
              <input
                type="text"
                id="displayName"
                className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                placeholder="Your creator name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Bio</label>
              <textarea
                id="bio"
                className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                placeholder="Tell us about yourself and your creations"
                rows={4}
              />
            </div>
          </div>

          <Button
            onClick={() => {
              const displayName = (document.getElementById('displayName') as HTMLInputElement).value
              const bio = (document.getElementById('bio') as HTMLTextAreaElement).value
              if (displayName && bio) {
                createCreatorProfile(displayName, bio)
              }
            }}
            className="w-full cosmic-btn"
          >
            Create Creator Profile
          </Button>
        </Card>
      </div>
    )
  }

  if (!creator) return null

  const tier = getCurrentTier()

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{creator.display_name}</h1>
            <div className="flex items-center gap-3">
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                {tier.badge}
              </Badge>
              {creator.is_verified && (
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  Verified Creator
                </Badge>
              )}
            </div>
          </div>
          <Button className="cosmic-btn">
            <Plus className="w-4 h-4 mr-2" />
            New Product
          </Button>
        </div>
        <p className="text-slate-300">{creator.bio}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="cosmic-card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400">Total Earnings</span>
            <DollarSign className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-white">${creator.total_earnings.toFixed(2)}</p>
          <p className="text-sm text-slate-400 mt-1">{creator.commission_rate}% commission rate</p>
        </Card>

        <Card className="cosmic-card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400">Total Sales</span>
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white">${creator.total_sales.toFixed(2)}</p>
          <p className="text-sm text-slate-400 mt-1">All-time revenue</p>
        </Card>

        <Card className="cosmic-card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400">Products</span>
            <Package className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-white">{products.length}</p>
          <p className="text-sm text-slate-400 mt-1">{products.filter(p => p.is_active).length} active</p>
        </Card>

        <Card className="cosmic-card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400">Downloads</span>
            <Download className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-3xl font-bold text-white">
            {products.reduce((sum, p) => sum + p.downloads_count, 0)}
          </p>
          <p className="text-sm text-slate-400 mt-1">Total downloads</p>
        </Card>
      </div>

      {/* Products List */}
      <Card className="cosmic-card p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Your Products</h2>
        
        {products.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">No products yet</p>
            <p className="text-sm mb-6">Create your first digital product to start earning</p>
            <Button className="cosmic-btn">
              <Plus className="w-4 h-4 mr-2" />
              Create Product
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50 border border-slate-700"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-semibold text-white">{product.product_name}</h3>
                    <Badge className={product.is_active ? "bg-green-500/20 text-green-300 border-green-500/30" : "bg-slate-500/20 text-slate-300 border-slate-500/30"}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span>{product.category}</span>
                    <span>${product.price_usd}</span>
                    <span>{product.downloads_count} downloads</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
