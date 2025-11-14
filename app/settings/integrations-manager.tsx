"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { CheckIcon, XIcon, LockIcon, Link as LinkIcon } from '@/components/icons'
import { INTEGRATION_REGISTRY, IntegrationManager } from '@/lib/integrations/integration-registry'

export default function IntegrationsManager() {
  const [userTier, setUserTier] = useState('free')
  const [connectedIntegrations, setConnectedIntegrations] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    loadIntegrations()
  }, [])
  
  const loadIntegrations = async () => {
    try {
      const response = await fetch('/api/integrations/list')
      if (response.ok) {
        const data = await response.json()
        setUserTier(data.userTier || 'free')
        setConnectedIntegrations(data.connected || [])
      }
    } catch (error) {
      console.error('[v0] Failed to load integrations:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const connectIntegration = async (integrationId: string) => {
    try {
      const response = await fetch(`/api/integrations/${integrationId}/connect`, {
        method: 'POST',
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.authUrl) {
          window.location.href = data.authUrl
        } else {
          setConnectedIntegrations([...connectedIntegrations, integrationId])
        }
      }
    } catch (error) {
      console.error('[v0] Failed to connect integration:', error)
      alert('Failed to connect integration')
    }
  }
  
  const disconnectIntegration = async (integrationId: string) => {
    try {
      const response = await fetch(`/api/integrations/${integrationId}/disconnect`, {
        method: 'POST',
      })
      
      if (response.ok) {
        setConnectedIntegrations(connectedIntegrations.filter(id => id !== integrationId))
      }
    } catch (error) {
      console.error('[v0] Failed to disconnect integration:', error)
      alert('Failed to disconnect integration')
    }
  }
  
  const availableIntegrations = IntegrationManager.getAvailableIntegrations(userTier)
  const categories = ['productivity', 'media', 'data', 'workflow']
  
  if (loading) {
    return <div className="text-center py-8">Loading integrations...</div>
  }
  
  return (
    <div className="space-y-8">
      <div className="border border-yellow-500/30 bg-yellow-500/10 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-400 mb-2">Integration Security</h3>
        <p className="text-sm text-yellow-200">
          All integrations are encrypted, audit-logged, and follow zero-trust principles. 
          Disabled by default per Charter compliance.
        </p>
      </div>
      
      {categories.map(category => {
        const categoryIntegrations = INTEGRATION_REGISTRY.filter(i => i.category === category)
        
        return (
          <div key={category}>
            <h3 className="text-lg font-semibold mb-4 capitalize">{category}</h3>
            <div className="grid gap-4">
              {categoryIntegrations.map(integration => {
                const hasAccess = IntegrationManager.hasAccess(integration.id, userTier)
                const isConnected = connectedIntegrations.includes(integration.id)
                const isDisabled = integration.disabled
                
                return (
                  <div key={integration.id} className="border border-slate-700 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="text-3xl">{integration.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{integration.name}</h4>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              integration.riskLevel === 'low' ? 'bg-green-500/20 text-green-400' :
                              integration.riskLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {integration.riskLevel} risk
                            </span>
                            {isDisabled && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-400">
                                Disabled
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-400 mt-1">{integration.description}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                            <span>Requires: {integration.requiresTier}</span>
                            <span>•</span>
                            <span>{integration.capabilities.join(', ')}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        {!hasAccess ? (
                          <Button variant="outline" size="sm" disabled className="gap-2">
                            <LockIcon className="w-4 h-4" />
                            Upgrade to {integration.requiresTier}
                          </Button>
                        ) : isDisabled ? (
                          <Button variant="outline" size="sm" disabled className="gap-2">
                            <XIcon className="w-4 h-4" />
                            Coming Soon
                          </Button>
                        ) : isConnected ? (
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="gap-2 bg-green-500/10 border-green-500/30">
                              <CheckIcon className="w-4 h-4 text-green-400" />
                              Connected
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => disconnectIntegration(integration.id)}
                            >
                              Disconnect
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => connectIntegration(integration.id)}
                            className="gap-2"
                          >
                            <LinkIcon className="w-4 h-4" />
                            Connect
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
