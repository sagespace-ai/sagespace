/**
 * Inference Mode Indicator
 * Shows users which AI provider is powering their experience
 * Per Charter: "Groq Fast Mode", "Turbo Mode", "Gateway Mode", "Premium Multimodal Mode"
 */

import { Zap, Rocket, Globe, Sparkles } from 'lucide-react'
import type { ModelProvider } from '@/lib/ai/model-registry'

interface InferenceIndicatorProps {
  provider: ModelProvider
  mode?: 'fast' | 'turbo' | 'gateway' | 'premium'
  className?: string
  showLabel?: boolean
}

export function InferenceIndicator({ 
  provider, 
  mode,
  className = '',
  showLabel = true 
}: InferenceIndicatorProps) {
  const config = getIndicatorConfig(provider, mode)
  
  return (
    <div 
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm ${className}`}
      style={{
        background: config.gradient,
        boxShadow: config.glow
      }}
    >
      <config.icon className="w-4 h-4" />
      {showLabel && (
        <span className="text-white drop-shadow-sm">{config.label}</span>
      )}
    </div>
  )
}

function getIndicatorConfig(provider: ModelProvider, mode?: string) {
  if (provider === 'groq') {
    if (mode === 'turbo') {
      return {
        icon: Rocket,
        label: 'Turbo Mode',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        glow: '0 0 20px rgba(102, 126, 234, 0.4)'
      }
    }
    return {
      icon: Zap,
      label: 'Groq Fast Mode',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
      glow: '0 0 20px rgba(6, 182, 212, 0.4)'
    }
  }
  
  if (provider === 'vercel-gateway') {
    return {
      icon: Globe,
      label: 'Gateway Mode',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      glow: '0 0 20px rgba(240, 147, 251, 0.4)'
    }
  }
  
  if (provider === 'huggingface') {
    return {
      icon: Sparkles,
      label: 'Premium Multimodal',
      gradient: 'linear-gradient(135deg, #ffd89b 0%, #19547b 100%)',
      glow: '0 0 20px rgba(255, 216, 155, 0.4)'
    }
  }
  
  // Default
  return {
    icon: Zap,
    label: 'AI Mode',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    glow: '0 0 20px rgba(168, 237, 234, 0.4)'
  }
}

/**
 * Compact inference badge for smaller UI areas
 */
export function InferenceBadge({ 
  provider, 
  className = '' 
}: { 
  provider: ModelProvider
  className?: string 
}) {
  const Icon = provider === 'groq' ? Zap : provider === 'vercel-gateway' ? Globe : Sparkles
  
  return (
    <div 
      className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${className}`}
      style={{
        background: getIndicatorConfig(provider).gradient,
        boxShadow: getIndicatorConfig(provider).glow
      }}
      title={getIndicatorConfig(provider).label}
    >
      <Icon className="w-3.5 h-3.5 text-white" />
    </div>
  )
}
