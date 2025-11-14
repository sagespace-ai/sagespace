'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { TrendingUp, Target, Zap, Award } from 'lucide-react'

export default function GamificationAnalyticsPage() {
  const [metrics, setMetrics] = useState<any>(null)

  useEffect(() => {
    fetchMetrics()
  }, [])

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/analytics/gamification')
      const data = await response.json()
      setMetrics(data.metrics)
    } catch (error) {
      console.error('[v0] Error fetching metrics:', error)
    }
  }

  if (!metrics) {
    return <div className="p-6">Loading metrics...</div>
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Gamification Analytics
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            icon={<Target className="w-6 h-6 text-purple-400" />}
            title="Quest Completion"
            value={`${(metrics.questCompletionRate * 100).toFixed(0)}%`}
            change="+12%"
          />
          <MetricCard
            icon={<Zap className="w-6 h-6 text-yellow-400" />}
            title="Avg Streak"
            value={`${metrics.averageStreakDays} days`}
            change="+2"
          />
          <MetricCard
            icon={<Award className="w-6 h-6 text-blue-400" />}
            title="Skill Progress"
            value={`${(metrics.skillTreeProgress * 100).toFixed(0)}%`}
            change="+15%"
          />
          <MetricCard
            icon={<TrendingUp className="w-6 h-6 text-green-400" />}
            title="Engagement Score"
            value={metrics.engagementScore.toFixed(1)}
            change="+0.5"
          />
        </div>

        <Card className="p-6 bg-black/40 border-purple-500/20 mb-6">
          <h2 className="text-xl font-semibold mb-4">Activity Heatmap</h2>
          <div className="h-64 flex items-center justify-center text-gray-400">
            Activity visualization coming soon
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 bg-black/40 border-purple-500/20">
            <h2 className="text-xl font-semibold mb-4">Favorite Features</h2>
            <div className="space-y-3">
              {metrics.favoriteFeatures.map((feature: string, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-300 capitalize">{feature}</span>
                  <div className="flex-1 mx-4 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                      style={{ width: `${(1 - index * 0.2) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-400">{(1 - index * 0.2) * 100}%</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-black/40 border-purple-500/20">
            <h2 className="text-xl font-semibold mb-4">Retention Risk</h2>
            <div className="text-center py-8">
              <div className={`
                inline-block px-6 py-3 rounded-full text-lg font-semibold
                ${metrics.retentionRisk === 'low' ? 'bg-green-500/20 text-green-300' :
                  metrics.retentionRisk === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                  'bg-red-500/20 text-red-300'}
              `}>
                {metrics.retentionRisk.toUpperCase()} RISK
              </div>
              <p className="text-gray-400 mt-4">Based on engagement patterns</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ icon, title, value, change }: any) {
  return (
    <Card className="p-6 bg-black/40 border-purple-500/20">
      <div className="flex items-start justify-between mb-4">
        <div>{icon}</div>
        <span className="text-sm text-green-400">{change}</span>
      </div>
      <h3 className="text-2xl font-bold mb-1">{value}</h3>
      <p className="text-sm text-gray-400">{title}</p>
    </Card>
  )
}
