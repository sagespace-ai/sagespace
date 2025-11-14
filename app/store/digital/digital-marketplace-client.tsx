'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, ShoppingBag, Star, Users } from 'lucide-react'
import { MARKETPLACE_CATEGORIES } from '@/config/marketplace'

interface MarketplaceProduct {
  id: string
  product_name: string
  description: string
  category: string
  price_usd: number
  preview_image_url?: string
  tags: string[]
  downloads_count: number
  creator: {
    display_name: string
    is_verified: boolean
  }
}

export default function DigitalMarketplaceClient() {
  const [products, setProducts] = useState<MarketplaceProduct[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const url = selectedCategory 
        ? `/api/marketplace/products?category=${selectedCategory}`
        : '/api/marketplace/products'
      
      const response = await fetch(url)
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Digital Marketplace
        </h1>
        <p className="text-xl text-slate-300 mb-8">
          Discover journals, guides, and tools created by the community
        </p>

        {/* Creator CTA */}
        <Card className="bg-slate-900/50 border-purple-500/30 p-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <h3 className="text-lg font-semibold text-white mb-1">Become a Creator</h3>
              <p className="text-sm text-slate-300">Share your cosmic creations and earn 85-90% of sales</p>
            </div>
            <Link href="/store/digital/creator">
              <Button className="cosmic-btn">
                <Users className="w-4 h-4 mr-2" />
                Start Creating
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 justify-center mb-12">
        <Button
          onClick={() => setSelectedCategory(null)}
          variant={selectedCategory === null ? 'default' : 'outline'}
          className="cosmic-btn"
        >
          All Products
        </Button>
        {Object.entries(MARKETPLACE_CATEGORIES).map(([key, cat]) => (
          <Button
            key={key}
            onClick={() => setSelectedCategory(key)}
            variant={selectedCategory === key ? 'default' : 'outline'}
            className="cosmic-btn"
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center text-slate-400 py-12">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-center text-slate-400 py-12">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">No products available yet</p>
          <p className="text-sm">Be the first to create digital goods for the community!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="cosmic-card p-6 hover:scale-105 transition-all duration-300">
              {product.preview_image_url ? (
                <img
                  src={product.preview_image_url || "/placeholder.svg"}
                  alt={product.product_name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg mb-4 flex items-center justify-center">
                  <Heart className="w-12 h-12 text-purple-400" />
                </div>
              )}

              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 mb-3">
                {MARKETPLACE_CATEGORIES[product.category as keyof typeof MARKETPLACE_CATEGORIES]?.label || product.category}
              </Badge>

              <h3 className="text-xl font-semibold text-white mb-2">
                {product.product_name}
              </h3>

              <p className="text-slate-300 text-sm mb-4 line-clamp-3">
                {product.description}
              </p>

              <div className="flex items-center gap-2 mb-4 text-sm text-slate-400">
                <span>{product.creator.display_name}</span>
                {product.creator.is_verified && (
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                    Verified
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {product.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    4.8
                  </span>
                  <span>{product.downloads_count} downloads</span>
                </div>
                <p className="text-2xl font-semibold text-white">
                  ${product.price_usd}
                </p>
              </div>

              <Button className="w-full mt-4 cosmic-btn">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Purchase
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
