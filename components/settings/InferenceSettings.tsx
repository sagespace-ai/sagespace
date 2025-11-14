/**
 * Inference Settings Panel
 * Allows users to see and understand their inference configuration
 */

import { Card } from '@/components/ui/card'
import { InferenceIndicator } from '../InferenceIndicator'
import { Check, Lock } from 'lucide-react'
import type { AccessLevel } from '@/lib/ai/model-registry'
import { getAvailableSageTiers } from '@/lib/sage-tiers'

interface InferenceSettingsProps {
  userAccessLevel: AccessLevel
}

export function InferenceSettings({ userAccessLevel }: InferenceSettingsProps) {
  const availableTiers = getAvailableSageTiers(userAccessLevel)
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Inference Configuration</h2>
        <p className="text-muted-foreground">
          Your current AI provider settings based on your subscription tier
        </p>
      </div>
      
      {/* Active providers */}
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Active Inference Modes</h3>
        
        <div className="space-y-4">
          {/* Groq - Always available */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <InferenceIndicator provider="groq" showLabel={false} />
              <div>
                <p className="font-medium">Groq Fast Mode</p>
                <p className="text-sm text-muted-foreground">
                  Zero-cost, ultra-fast inference for all users
                </p>
              </div>
            </div>
            <Check className="w-5 h-5 text-green-500" />
          </div>
          
          {/* Gateway - Explorer+ */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <InferenceIndicator provider="vercel-gateway" showLabel={false} />
              <div>
                <p className="font-medium">Gateway Mode</p>
                <p className="text-sm text-muted-foreground">
                  Fallback provider for enhanced reliability
                </p>
              </div>
            </div>
            {['explorer', 'voyager', 'astral', 'oracle', 'celestial'].includes(userAccessLevel) ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <Lock className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
          
          {/* HuggingFace - Oracle+ */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <InferenceIndicator provider="huggingface" showLabel={false} />
              <div>
                <p className="font-medium">Premium Multimodal Mode</p>
                <p className="text-sm text-muted-foreground">
                  Vision, audio, and advanced AI capabilities
                </p>
              </div>
            </div>
            {['oracle', 'celestial'].includes(userAccessLevel) ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <Lock className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
        </div>
      </Card>
      
      {/* Sage tiers */}
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Available Sage Tiers</h3>
        
        <div className="space-y-3">
          {availableTiers.map(tier => (
            <div key={tier.tier} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="font-medium">{tier.displayName}</p>
                <p className="text-sm text-muted-foreground">{tier.description}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                {tier.costLevel}
              </span>
            </div>
          ))}
        </div>
      </Card>
      
      {/* Charter compliance notice */}
      <Card className="p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/20">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Charter Compliant:</span> All inference
          uses Groq's free tier by default, ensuring zero-cost operation while maintaining 
          ultra-fast performance. Premium features are monetization-gated per the Master Charter.
        </p>
      </Card>
    </div>
  )
}
