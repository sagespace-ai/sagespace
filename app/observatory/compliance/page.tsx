"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Download, RefreshCw, AlertCircle, CheckCircle, Clock } from '@/components/icons'

interface ComplianceLog {
  id: string
  timestamp: string
  correlationId: string
  userId: string
  agentId?: string
  inputSummary: string
  outputSummary: string
  modelProvider: string
  modelId: string
  riskLevel: string
  dataSources: string[]
  guardrailsPassed: boolean
  governanceChecksPassed: boolean
  processingTimeMs: number
}

export default function CompliancePage() {
  const [logs, setLogs] = useState<ComplianceLog[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'low' | 'medium' | 'high' | 'critical'>('all')
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d')
  
  useEffect(() => {
    loadLogs()
  }, [timeRange, filter])
  
  const loadLogs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filter !== 'all') {
        params.append('riskLevel', filter)
      }
      
      const now = new Date()
      const ranges = {
        '24h': 1,
        '7d': 7,
        '30d': 30,
        '90d': 90,
      }
      const startDate = new Date(now.getTime() - ranges[timeRange] * 24 * 60 * 60 * 1000)
      params.append('startDate', startDate.toISOString())
      
      const response = await fetch(`/api/compliance/logs?${params}`)
      if (response.ok) {
        const data = await response.json()
        setLogs(data.logs || [])
      }
    } catch (error) {
      console.error('[v0] Failed to load compliance logs:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const exportReport = async () => {
    try {
      const response = await fetch(`/api/compliance/report?startDate=${timeRange}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `compliance-report-${new Date().toISOString()}.pdf`
        a.click()
      }
    } catch (error) {
      console.error('[v0] Failed to export report:', error)
      alert('Failed to export compliance report')
    }
  }
  
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-400 bg-green-500/10 border-green-500/30'
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
      case 'high': return 'text-orange-400 bg-orange-500/10 border-orange-500/30'
      case 'critical': return 'text-red-400 bg-red-500/10 border-red-500/30'
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/30'
    }
  }
  
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              ISO 42001 Compliance Dashboard
            </span>
          </h1>
          <p className="text-slate-400">
            Audit-ready activity log for all AI operations
          </p>
        </div>
        
        {/* Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            {['24h', '7d', '30d', '90d'].map(range => (
              <Button
                key={range}
                onClick={() => setTimeRange(range as any)}
                variant={timeRange === range ? 'default' : 'outline'}
                size="sm"
              >
                {range}
              </Button>
            ))}
          </div>
          
          <div className="flex gap-2">
            {['all', 'low', 'medium', 'high', 'critical'].map(f => (
              <Button
                key={f}
                onClick={() => setFilter(f as any)}
                variant={filter === f ? 'default' : 'outline'}
                size="sm"
                className={filter === f ? getRiskColor(f) : ''}
              >
                {f}
              </Button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Button onClick={loadLogs} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={exportReport} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="border border-slate-700 rounded-lg p-4">
            <div className="text-2xl font-bold">{logs.length}</div>
            <div className="text-sm text-slate-400">Total Operations</div>
          </div>
          <div className="border border-green-500/30 bg-green-500/5 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">
              {logs.filter(l => l.riskLevel === 'low').length}
            </div>
            <div className="text-sm text-slate-400">Low Risk</div>
          </div>
          <div className="border border-yellow-500/30 bg-yellow-500/5 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-400">
              {logs.filter(l => l.riskLevel === 'medium' || l.riskLevel === 'high').length}
            </div>
            <div className="text-sm text-slate-400">Med-High Risk</div>
          </div>
          <div className="border border-red-500/30 bg-red-500/5 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-400">
              {logs.filter(l => !l.governanceChecksPassed || !l.guardrailsPassed).length}
            </div>
            <div className="text-sm text-slate-400">Violations</div>
          </div>
        </div>
        
        {/* Logs Table */}
        <div className="border border-slate-700 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-900 border-b border-slate-700">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-slate-300">Timestamp</th>
                <th className="text-left p-4 text-sm font-medium text-slate-300">Operation</th>
                <th className="text-left p-4 text-sm font-medium text-slate-300">Model</th>
                <th className="text-left p-4 text-sm font-medium text-slate-300">Risk</th>
                <th className="text-left p-4 text-sm font-medium text-slate-300">Data Sources</th>
                <th className="text-left p-4 text-sm font-medium text-slate-300">Compliance</th>
                <th className="text-left p-4 text-sm font-medium text-slate-300">Time</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center p-8 text-slate-500">
                    Loading compliance logs...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-8 text-slate-500">
                    No compliance logs found for selected filters
                  </td>
                </tr>
              ) : (
                logs.map(log => (
                  <tr key={log.id} className="border-b border-slate-800 hover:bg-slate-900/50">
                    <td className="p-4 text-sm">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <div className="text-sm">{log.inputSummary.substring(0, 50)}...</div>
                      <div className="text-xs text-slate-500">{log.correlationId}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-mono">{log.modelProvider}</div>
                      <div className="text-xs text-slate-500">{log.modelId}</div>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded-full border ${getRiskColor(log.riskLevel)}`}>
                        {log.riskLevel}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {log.dataSources.map((source, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 bg-slate-700 rounded">
                            {source}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {log.guardrailsPassed && log.governanceChecksPassed ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-400" />
                        )}
                        <span className="text-xs">
                          {log.guardrailsPassed && log.governanceChecksPassed ? 'Passed' : 'Failed'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="w-3 h-3" />
                        {log.processingTimeMs}ms
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
