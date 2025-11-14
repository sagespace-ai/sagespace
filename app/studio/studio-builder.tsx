"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Save, Play, Download, Upload, Trash2, AlertCircle, CheckCircle } from "@/components/icons"
import type { AgentBehaviorConfig, AgentFlowBlock } from "@/lib/agents/agent-builder-types-client"

export default function StudioBuilder() {
  const [config, setConfig] = useState<Partial<AgentBehaviorConfig>>({
    name: "",
    personality: {
      directness: 50,
      empathy: 50,
      formality: 50,
      creativity: 50,
    },
    reasoning: {
      style: "chain-of-thought",
      maxSteps: 5,
      requiresCitations: true,
    },
    capabilities: [],
    integrations: [],
    flowBlocks: [],
  })
  
  const [activeTab, setActiveTab] = useState<'behavior' | 'flows' | 'integrations' | 'compliance'>('behavior')
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null)
  const [healthCheck, setHealthCheck] = useState<any>(null)
  const [showHealthCheck, setShowHealthCheck] = useState(false)
  
  const addFlowBlock = (type: 'trigger' | 'condition' | 'action') => {
    const newBlock: AgentFlowBlock = {
      id: `block-${Date.now()}`,
      type,
      data: type === 'trigger' 
        ? { id: `trigger-${Date.now()}`, type: 'user-asks', config: {} }
        : type === 'condition'
        ? { id: `cond-${Date.now()}`, type: 'topic-is', operator: 'equals', value: '' }
        : { id: `action-${Date.now()}`, type: 'use-sage', config: {} },
      position: { x: 100 + (config.flowBlocks?.length || 0) * 200, y: 100 },
      connections: [],
    }
    
    setConfig({
      ...config,
      flowBlocks: [...(config.flowBlocks || []), newBlock],
    })
  }
  
  const runHealthCheck = async (agentId: string) => {
    try {
      const response = await fetch('/api/self-healing/agent-health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId }),
      })
      
      if (response.ok) {
        const data = await response.json()
        setHealthCheck(data.healthCheck)
        setShowHealthCheck(true)
        console.log('[v0] Health check results:', data)
      }
    } catch (error) {
      console.error('[v0] Health check failed:', error)
    }
  }
  
  const saveAgent = async () => {
    console.log('[v0] Saving agent config:', config)
    
    try {
      const response = await fetch('/api/agents/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })
      
      if (response.ok) {
        const data = await response.json()
        alert('Agent saved successfully!')
        
        // Run health check after save
        if (data.agentId) {
          await runHealthCheck(data.agentId)
        }
      }
    } catch (error) {
      console.error('[v0] Failed to save agent:', error)
      alert('Failed to save agent')
    }
  }
  
  const exportAgent = () => {
    const json = JSON.stringify(config, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${config.name || 'agent'}-config.json`
    a.click()
  }
  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Agent Builder Studio</h1>
          <div className="flex gap-2">
            <Button onClick={saveAgent} className="bg-gradient-to-r from-purple-500 to-cyan-500">
              <Save className="w-4 h-4 mr-2" />
              Save Agent
            </Button>
            <Button onClick={exportAgent} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline">
              <Play className="w-4 h-4 mr-2" />
              Test
            </Button>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-white/10">
        <div className="flex gap-4 px-4">
          {['behavior', 'flows', 'integrations', 'compliance'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-3 capitalize ${
                activeTab === tab
                  ? 'border-b-2 border-cyan-500 text-cyan-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      
      {showHealthCheck && healthCheck && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-slate-900 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Agent Health Check</h3>
              <Button variant="ghost" onClick={() => setShowHealthCheck(false)}>
                Close
              </Button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold">{healthCheck.healthScore}</div>
                <div className="flex-1">
                  <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        healthCheck.healthScore >= 80 ? 'bg-green-500' :
                        healthCheck.healthScore >= 60 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${healthCheck.healthScore}%` }}
                    />
                  </div>
                  <div className="text-sm text-slate-400 mt-1">
                    {healthCheck.healthScore >= 80 ? 'Healthy' :
                     healthCheck.healthScore >= 60 ? 'Needs Attention' :
                     'Critical Issues'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              {healthCheck.issues.map((issue: any, i: number) => (
                <div key={i} className="border border-slate-700 rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2">
                      {issue.severity === 'critical' ? (
                        <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                      ) : issue.severity === 'high' ? (
                        <AlertCircle className="w-5 h-5 text-orange-400 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                      )}
                      <div>
                        <div className="font-medium">{issue.description}</div>
                        <div className="text-xs text-slate-500 mt-1">
                          {issue.category} • {issue.severity}
                        </div>
                      </div>
                    </div>
                    {issue.autoFixable && (
                      <Button size="sm" variant="outline">
                        Auto-Fix
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              
              {healthCheck.issues.length === 0 && (
                <div className="text-center py-8 text-green-400">
                  <CheckCircle className="w-12 h-12 mx-auto mb-2" />
                  <div>No issues found!</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className="p-6">
        {activeTab === 'behavior' && (
          <div className="max-w-4xl space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Agent Name</label>
              <input
                type="text"
                value={config.name || ''}
                onChange={(e) => setConfig({ ...config, name: e.target.value })}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg"
                placeholder="My Custom Agent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={config.description || ''}
                onChange={(e) => setConfig({ ...config, description: e.target.value })}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg"
                rows={3}
                placeholder="What does your agent do?"
              />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Personality Sliders</h3>
              <div className="space-y-4">
                {Object.entries(config.personality || {}).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between mb-2">
                      <label className="capitalize">{key}</label>
                      <span className="text-cyan-400">{value}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={value}
                      onChange={(e) => setConfig({
                        ...config,
                        personality: {
                          ...config.personality!,
                          [key]: parseInt(e.target.value),
                        },
                      })}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'flows' && (
          <div>
            <div className="mb-4 flex gap-2">
              <Button onClick={() => addFlowBlock('trigger')} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Trigger
              </Button>
              <Button onClick={() => addFlowBlock('condition')} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Condition
              </Button>
              <Button onClick={() => addFlowBlock('action')} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Action
              </Button>
            </div>
            
            <div className="border border-slate-700 rounded-lg p-8 min-h-[500px] relative bg-slate-900/50">
              {config.flowBlocks?.map((block) => (
                <div
                  key={block.id}
                  className={`absolute p-4 border-2 rounded-lg cursor-pointer ${
                    selectedBlock === block.id
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-slate-700 bg-slate-800'
                  }`}
                  style={{
                    left: block.position.x,
                    top: block.position.y,
                  }}
                  onClick={() => setSelectedBlock(block.id)}
                >
                  <div className="text-xs text-slate-400 uppercase">{block.type}</div>
                  <div className="font-medium">
                    {block.type === 'trigger' && `Trigger: ${(block.data as any).type}`}
                    {block.type === 'condition' && `Condition: ${(block.data as any).type}`}
                    {block.type === 'action' && `Action: ${(block.data as any).type}`}
                  </div>
                </div>
              ))}
              
              {config.flowBlocks?.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                  Add trigger, condition, or action blocks to build your agent flow
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'integrations' && (
          <div className="max-w-4xl">
            <p className="text-slate-400 mb-4">Configure which integrations your agent can use</p>
            <div className="grid gap-4">
              {['Spotify', 'Notion', 'GitHub', 'Google Drive', 'Slack', 'Health Check'].map((integration) => (
                <div key={integration} className="border border-slate-700 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{integration}</div>
                    <div className="text-sm text-slate-400">
                      {integration === 'Health Check' ? 'Run health check on your agent' : `Allow agent to access ${integration} data`}
                    </div>
                  </div>
                  {integration === 'Health Check' ? (
                    <Button variant="outline" size="sm" onClick={() => runHealthCheck('your-agent-id')}>
                      Run Check
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'compliance' && (
          <div className="max-w-4xl">
            <div className="border border-yellow-500/30 bg-yellow-500/10 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-yellow-400 mb-2">ISO 42001 Compliance Check</h3>
              <p className="text-sm text-yellow-200">
                This agent will be validated for Charter compliance and domain boundaries before activation.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-slate-700 rounded-lg">
                <span>Domain Boundary Check</span>
                <span className="text-green-400">Passed</span>
              </div>
              <div className="flex items-center justify-between p-4 border border-slate-700 rounded-lg">
                <span>Safety Guardrails</span>
                <span className="text-green-400">Active</span>
              </div>
              <div className="flex items-center justify-between p-4 border border-slate-700 rounded-lg">
                <span>Data Privacy</span>
                <span className="text-green-400">Compliant</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
