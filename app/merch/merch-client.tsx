'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Sparkles, Wand2 } from 'lucide-react'
import { POD_PRODUCT_TYPES, COSMIC_THEMES, POD_PLATFORMS } from '@/config/pod-products'

interface PODProduct {
  id: string
  product_type: string
  product_name: string
  base_price_usd: number
  external_url: string
  platform: string
  design: {
    design_name: string
    theme: string
    design_concept: string
    color_palette: string[]
    product_description: string
  }
}

export default function MerchClient() {
  const [products, setProducts] = useState<PODProduct[]>([])
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState<string>(COSMIC_THEMES[0])

  useEffect(() => {
    fetchProducts()
  }, [selectedType])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const url = selectedType 
        ? `/api/pod/products?type=${selectedType}`
        : '/api/pod/products'
      
      const response = await fetch(url)
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateCustomDesign = async () => {
    try {
      setGenerating(true)
      const response = await fetch('/api/pod/generate-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productType: 'poster',
          theme: selectedTheme,
          userPreferences: { style: 'cosmic', vibe: 'mindful' }
        })
      })

      const data = await response.json()
      
      if (data.design) {
        alert(`Design "${data.design.design_name}" created! Check your designs in the gallery.`)
        fetchProducts()
      }
    } catch (error) {
      console.error('Error generating design:', error)
      alert('Failed to generate design. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  const trackClick = async (productId: string, url: string) => {
    try {
      await fetch('/api/pod/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          interactionType: 'external_click'
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
          Cosmic Merch
        </h1>
        <p className="text-xl text-slate-300 mb-8">
          Agent-designed merchandise with cosmic vibes
        </p>

        {/* AI Design Generator */}
        <Card className="bg-slate-900/50 border-purple-500/30 p-8 max-w-2xl mx-auto mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Wand2 className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-semibold text-white">AI Design Generator</h2>
          </div>
          <p className="text-slate-300 mb-6">
            Let the Sage Merchant Agent create a custom cosmic design for you
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <select
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
              className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
            >
              {COSMIC_THEMES.map((theme) => (
                <option key={theme} value={theme}>
                  {theme}
                </option>
              ))}
            </select>

            <Button
              onClick={generateCustomDesign}
              disabled={generating}
              className="cosmic-btn"
            >
              {generating ? (
                <>Generating...</>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Design
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>

      {/* Product Type Filter */}
      <div className="flex flex-wrap gap-3 justify-center mb-12">
        <Button
          onClick={() => setSelectedType(null)}
          variant={selectedType === null ? 'default' : 'outline'}
          className="cosmic-btn"
        >
          All Products
        </Button>
        {Object.entries(POD_PRODUCT_TYPES).map(([key, type]) => (
          <Button
            key={key}
            onClick={() => setSelectedType(key)}
            variant={selectedType === key ? 'default' : 'outline'}
            className="cosmic-btn"
          >
            {type.label}
          </Button>
        ))}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center text-slate-400 py-12">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-center text-slate-400 py-12">
          <p className="mb-4">No products available yet.</p>
          <p className="text-sm">Use the AI Design Generator above to create custom designs!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="cosmic-card p-6 hover:scale-105 transition-all duration-300">
              <div className="aspect-square bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                <div 
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: `linear-gradient(135deg, ${product.design.color_palette.join(', ')})`
                  }}
                />
                <Sparkles className="w-16 h-16 text-purple-400 relative z-10" />
              </div>
              
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 mb-3">
                {POD_PRODUCT_TYPES[product.product_type as keyof typeof POD_PRODUCT_TYPES]?.label || product.product_type}
              </Badge>

              <h3 className="text-xl font-semibold text-white mb-2">
                {product.product_name}
              </h3>
              
              <p className="text-slate-300 text-sm mb-4 line-clamp-3">
                {product.design.product_description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {product.design.color_palette.slice(0, 4).map((color, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full border-2 border-slate-700"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                <div>
                  <p className="text-sm text-slate-400">From {POD_PLATFORMS[product.platform as keyof typeof POD_PLATFORMS]?.name}</p>
                  <p className="text-lg font-semibold text-white">
                    ${product.base_price_usd}
                  </p>
                </div>
                
                <Button
                  onClick={() => trackClick(product.id, product.external_url)}
                  className="cosmic-btn"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Buy Now
                </Button>
              </div>

              <p className="text-xs text-slate-500 mt-4">
                Fulfilled by {POD_PLATFORMS[product.platform as keyof typeof POD_PLATFORMS]?.name} - Zero inventory, shipped directly to you
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
