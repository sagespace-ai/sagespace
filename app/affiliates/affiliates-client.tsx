'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Heart, BookOpen, Cloud, Book, Music, Info } from 'lucide-react'
import { AFFILIATE_CATEGORIES, FTC_DISCLOSURE } from '@/config/affiliates'

interface AffiliateProduct {
  id: string
  product_name: string
  description: string
  category: string
  affiliate_url: string
  price_usd: number
  image_url?: string
  tags: string[]
  is_featured: boolean
  partner: {
    name: string
    disclosure_text: string
  }
}

const CATEGORY_ICONS = {
  wellness: Heart,
  courses: BookOpen,
  storage: Cloud,
  books: Book,
  music: Music
}

export default function AffiliatesClient() {
  const [products, setProducts] = useState<AffiliateProduct[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const url = selectedCategory 
        ? `/api/affiliates/products?category=${selectedCategory}`
        : '/api/affiliates/products?featured=true'
      
      const response = await fetch(url)
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const trackClick = async (productId: string, url: string) => {
    try {
      await fetch('/api/affiliates/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          interactionType: 'click'
        })
      })
      window.open(url, '_blank')
    } catch (error) {
      console.error('Error tracking click:', error)
      window.open(url, '_blank')
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Sage Recommendations
        </h1>
        <p className="text-xl text-slate-300 mb-8">
          Curated tools and resources to support your journey
        </p>
        
        {/* FTC Disclosure */}
        <Card className="bg-slate-900/50 border-slate-700 p-6 max-w-3xl mx-auto">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
            <div className="text-left">
              <h3 className="font-semibold text-white mb-2">Affiliate Disclosure</h3>
              <p className="text-sm text-slate-300">
                SageSpace participates in affiliate programs. When you purchase through our links, we may earn a commission at no additional cost to you. This helps us keep SageSpace running and improve our services. We only recommend products we believe will genuinely benefit our community.
              </p>
            </div>
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
          Featured
        </Button>
        {Object.entries(AFFILIATE_CATEGORIES).map(([key, cat]) => {
          const Icon = CATEGORY_ICONS[key as keyof typeof CATEGORY_ICONS]
          return (
            <Button
              key={key}
              onClick={() => setSelectedCategory(key)}
              variant={selectedCategory === key ? 'default' : 'outline'}
              className="cosmic-btn"
            >
              <Icon className="w-4 h-4 mr-2" />
              {cat.label}
            </Button>
          )
        })}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center text-slate-400 py-12">Loading recommendations...</div>
      ) : products.length === 0 ? (
        <div className="text-center text-slate-400 py-12">No recommendations available</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="cosmic-card p-6 hover:scale-105 transition-all duration-300">
              {product.image_url && (
                <img
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.product_name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              
              <div className="mb-3">
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                  {product.category}
                </Badge>
                {product.is_featured && (
                  <Badge className="ml-2 bg-blue-500/20 text-blue-300 border-blue-500/30">
                    Featured
                  </Badge>
                )}
              </div>

              <h3 className="text-xl font-semibold text-white mb-2">
                {product.product_name}
              </h3>
              
              <p className="text-slate-300 text-sm mb-4 line-clamp-3">
                {product.description}
              </p>

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
                <div>
                  <p className="text-sm text-slate-400">From {product.partner.name}</p>
                  {product.price_usd > 0 && (
                    <p className="text-lg font-semibold text-white">
                      ${product.price_usd}
                    </p>
                  )}
                </div>
                
                <Button
                  onClick={() => trackClick(product.id, product.affiliate_url)}
                  className="cosmic-btn"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Offer
                </Button>
              </div>

              <p className="text-xs text-slate-500 mt-4 italic">
                {product.partner.disclosure_text}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
