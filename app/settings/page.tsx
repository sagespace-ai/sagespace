"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { User, Shield, Bell, Eye, Palette, Wrench, CreditCard, ArrowLeft, Check, Sparkles, Zap, TrendingUp, XCircle, Info, Star } from "@/components/icons"
import type { AIProposal } from "@/lib/types/personalization"

export default function SettingsPage() {
  const [saveStatus, setSaveStatus] = useState<string | null>(null)
  const [settings, setSettings] = useState({
    // Profile
    handle: "sage_explorer",
    bio: "Exploring the multiverse of AI companions",
    visibility: "public",
    // Notifications
    notifyFollows: true,
    notifyRemixes: true,
    notifyPayouts: false,
    dailyDigest: true,
    // Privacy
    showActivity: true,
    allowIndexing: true,
    retentionDays: 90,
    // Appearance
    theme: "system",
    reduceMotion: false,
    feedDensity: "comfortable",
    // Studio
    defaultVisibility: "public",
    safetyLevel: "moderate",
    toolBudget: 100,
  })

  const [aiProposals, setAiProposals] = useState<AIProposal[]>([])
  const [designKarma, setDesignKarma] = useState({
    karmaPoints: 0,
    architectLevel: 1,
    reviewStreak: 0,
    proposalsReviewed: 0,
  })
  const [loadingProposals, setLoadingProposals] = useState(false)
  const [analyzingBehavior, setAnalyzingBehavior] = useState(false)

  const [spotifyStatus, setSpotifyStatus] = useState<{
    connected: boolean
    isExpired?: boolean
    metadata?: any
    connectedAt?: string
    requiresAuth?: boolean
  }>({ connected: false })
  const [loadingSpotify, setLoadingSpotify] = useState(false)

  useEffect(() => {
    // Check Spotify connection status on mount
    fetch('/api/spotify/status')
      .then(res => res.json())
      .then(data => setSpotifyStatus(data))
      .catch(err => console.error('Failed to check Spotify status:', err))
      
    // Check for connection success/error in URL
    const params = new URLSearchParams(window.location.search)
    if (params.get('spotify') === 'connected') {
      setSaveStatus('Spotify connected successfully!')
      setTimeout(() => setSaveStatus(null), 3000)
      // Refresh status
      fetch('/api/spotify/status')
        .then(res => res.json())
        .then(data => setSpotifyStatus(data))
    }

    loadAIProposals()
    loadDesignKarma()
  }, [])

  const loadAIProposals = async () => {
    try {
      setLoadingProposals(true)
      const res = await fetch('/api/personalization')
      if (res.ok) {
        const data = await res.json()
        setAiProposals(data.ai_proposals?.pendingChanges || [])
      }
    } catch (error) {
      console.error('Failed to load AI proposals:', error)
    } finally {
      setLoadingProposals(false)
    }
  }

  const loadDesignKarma = async () => {
    try {
      const res = await fetch('/api/design-karma')
      if (res.ok) {
        const data = await res.json()
        setDesignKarma(data)
      }
    } catch (error) {
      console.error('Failed to load design karma:', error)
    }
  }

  const triggerAnalysis = async () => {
    try {
      setAnalyzingBehavior(true)
      setSaveStatus('Analyzing your behavior patterns...')
      
      const res = await fetch('/api/dreamer/analyze', { method: 'POST' })
      const data = await res.json()
      
      if (res.ok) {
        setSaveStatus(`Generated ${data.proposalsGenerated} new suggestions!`)
        await loadAIProposals()
      } else {
        setSaveStatus('Analysis failed - please try again')
      }
      
      setTimeout(() => setSaveStatus(null), 3000)
    } catch (error) {
      console.error('Failed to trigger analysis:', error)
      setSaveStatus('Analysis failed - please try again')
      setTimeout(() => setSaveStatus(null), 3000)
    } finally {
      setAnalyzingBehavior(false)
    }
  }

  const approveProposal = async (proposalId: string) => {
    try {
      console.log('[v0] [Settings] Approving proposal:', proposalId)
      
      const res = await fetch('/api/proposals/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposalId }),
      })

      const data = await res.json()
      console.log('[v0] [Settings] Approval response:', data)

      if (res.ok) {
        setSaveStatus(`✅ Approved: ${data.proposalTitle}. Changes applied!`)
        
        await Promise.all([
          loadAIProposals(),
          loadDesignKarma()
        ])
        
        console.log('[v0] [Settings] ✅ Proposal approved successfully')
        
        setTimeout(() => setSaveStatus(null), 5000)
      } else {
        console.error('[v0] [Settings] Approval failed:', data)
        setSaveStatus(`❌ Failed to approve: ${data.error}`)
        setTimeout(() => setSaveStatus(null), 5000)
      }
    } catch (error) {
      console.error('[v0] [Settings] Failed to approve proposal:', error)
      setSaveStatus('❌ Network error - please try again')
      setTimeout(() => setSaveStatus(null), 5000)
    }
  }

  const rejectProposal = async (proposalId: string, reason?: string) => {
    try {
      console.log('[v0] [Settings] Rejecting proposal:', proposalId, 'Reason:', reason)
      
      const res = await fetch('/api/proposals/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposalId, reason }),
      })

      const data = await res.json()
      console.log('[v0] [Settings] Rejection response:', data)

      if (res.ok) {
        setSaveStatus('✅ Proposal rejected. AI will learn from your preference.')
        await Promise.all([
          loadAIProposals(),
          loadDesignKarma()
        ])
        console.log('[v0] [Settings] ✅ Proposal rejected successfully')
        setTimeout(() => setSaveStatus(null), 5000)
      } else {
        console.error('[v0] [Settings] Rejection failed:', data)
        setSaveStatus(`❌ Failed to reject: ${data.error}`)
        setTimeout(() => setSaveStatus(null), 5000)
      }
    } catch (error) {
      console.error('[v0] [Settings] Failed to reject proposal:', error)
      setSaveStatus('❌ Network error - please try again')
      setTimeout(() => setSaveStatus(null), 5000)
    }
  }

  const getImpactBadge = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const handleConnectSpotify = () => {
    if (spotifyStatus.requiresAuth) {
      window.location.href = '/auth/login?redirect=/settings?tab=integrations'
      return
    }
    window.location.href = '/api/spotify/auth'
  }

  const handleDisconnectSpotify = async () => {
    setLoadingSpotify(true)
    try {
      const res = await fetch('/api/spotify/disconnect', { method: 'POST' })
      if (res.ok) {
        setSpotifyStatus({ connected: false })
        setSaveStatus('Spotify disconnected')
        setTimeout(() => setSaveStatus(null), 3000)
      }
    } catch (err) {
      console.error('Failed to disconnect Spotify:', err)
    } finally {
      setLoadingSpotify(false)
    }
  }

  const handleSave = async (section: string) => {
    setSaveStatus("saving")
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    setSaveStatus("saved")
    setTimeout(() => setSaveStatus(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Animated background */}
      <div className="fixed inset-0 opacity-30">
        <div
          className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 animate-gradient"
          style={{ backgroundSize: "200% 200%" }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Hub
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Settings Universe
          </h1>
          <p className="text-gray-400 mt-2">Customize your SageSpace experience</p>
        </div>

        {/* Save status indicator */}
        {saveStatus && (
          <div className="fixed top-4 right-4 z-50 bg-slate-800/90 backdrop-blur-sm border border-cyan-500/30 rounded-lg px-4 py-3 flex items-center gap-2 animate-slide-down">
            {saveStatus === "saving" ? (
              <>
                <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
                <span className="text-sm text-gray-300">Saving...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300">{saveStatus}</span>
              </>
            )}
          </div>
        )}

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-slate-800/50 border border-slate-700/50 p-1 flex-wrap h-auto">
            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
            >
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
            >
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger
              value="privacy"
              className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
            >
              <Eye className="w-4 h-4 mr-2" />
              Privacy
            </TabsTrigger>
            <TabsTrigger
              value="appearance"
              className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
            >
              <Palette className="w-4 h-4 mr-2" />
              Appearance
            </TabsTrigger>
            <TabsTrigger
              value="studio"
              className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
            >
              <Wrench className="w-4 h-4 mr-2" />
              Studio
            </TabsTrigger>
            <TabsTrigger
              value="billing"
              className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Billing
            </TabsTrigger>
            <TabsTrigger
              value="integrations"
              className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
            >
              <Wrench className="w-4 h-4 mr-2" />
              Integrations
            </TabsTrigger>
            <TabsTrigger
              value="adaptive"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-cyan-500/20 data-[state=active]:text-cyan-400"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Adaptive Mode
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Profile Information</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="handle" className="text-gray-300">
                    Handle
                  </Label>
                  <Input
                    id="handle"
                    value={settings.handle}
                    onChange={(e) => setSettings({ ...settings, handle: e.target.value })}
                    className="bg-slate-900/50 border-slate-600 text-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">Your unique identifier on SageSpace</p>
                </div>

                <div>
                  <Label htmlFor="bio" className="text-gray-300">
                    Bio
                  </Label>
                  <Input
                    id="bio"
                    value={settings.bio}
                    onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
                    className="bg-slate-900/50 border border-slate-600 text-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">Tell others about yourself</p>
                </div>

                <div>
                  <Label htmlFor="visibility" className="text-gray-300">
                    Profile Visibility
                  </Label>
                  <select
                    id="visibility"
                    value={settings.visibility}
                    onChange={(e) => setSettings({ ...settings, visibility: e.target.value })}
                    className="w-full bg-slate-900/50 border border-slate-600 text-white rounded-md px-3 py-2"
                  >
                    <option value="public">Public</option>
                    <option value="followers">Followers Only</option>
                    <option value="private">Private</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Control who can see your profile</p>
                </div>

                <Button onClick={() => handleSave("profile")} className="bg-gradient-to-r from-cyan-500 to-purple-500">
                  Save Profile
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Notification Preferences</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300">New Followers</Label>
                    <p className="text-xs text-gray-500">Get notified when someone follows you</p>
                  </div>
                  <Switch
                    checked={settings.notifyFollows}
                    onCheckedChange={(checked) => setSettings({ ...settings, notifyFollows: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300">Remixes & Collaborations</Label>
                    <p className="text-xs text-gray-500">When others remix your Sages or artifacts</p>
                  </div>
                  <Switch
                    checked={settings.notifyRemixes}
                    onCheckedChange={(checked) => setSettings({ ...settings, notifyRemixes: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300">Daily Digest</Label>
                    <p className="text-xs text-gray-500">Summary of activity and trending content</p>
                  </div>
                  <Switch
                    checked={settings.dailyDigest}
                    onCheckedChange={(checked) => setSettings({ ...settings, dailyDigest: checked })}
                  />
                </div>

                <Button
                  onClick={() => handleSave("notifications")}
                  className="bg-gradient-to-r from-cyan-500 to-purple-500"
                >
                  Save Preferences
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Privacy & Data Controls</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300">Show Activity Status</Label>
                    <p className="text-xs text-gray-500">Let others see when you're online</p>
                  </div>
                  <Switch
                    checked={settings.showActivity}
                    onCheckedChange={(checked) => setSettings({ ...settings, showActivity: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300">Search Engine Indexing</Label>
                    <p className="text-xs text-gray-500">Allow search engines to index your public profile</p>
                  </div>
                  <Switch
                    checked={settings.allowIndexing}
                    onCheckedChange={(checked) => setSettings({ ...settings, allowIndexing: checked })}
                  />
                </div>

                <div>
                  <Label htmlFor="retention" className="text-gray-300">
                    Memory Retention (Days)
                  </Label>
                  <Input
                    id="retention"
                    type="number"
                    value={settings.retentionDays}
                    onChange={(e) => setSettings({ ...settings, retentionDays: Number.parseInt(e.target.value) })}
                    className="bg-slate-900/50 border-slate-600 text-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">How long to keep conversation memories (30-365 days)</p>
                </div>

                <div className="pt-4 border-t border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-2">Data Rights</h3>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start border-slate-600 text-gray-300 hover:text-white bg-transparent"
                    >
                      Export My Data
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-slate-600 text-gray-300 hover:text-white bg-transparent"
                    >
                      Request Data Deletion
                    </Button>
                  </div>
                </div>

                <Button onClick={() => handleSave("privacy")} className="bg-gradient-to-r from-cyan-500 to-purple-500">
                  Save Privacy Settings
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-6">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Connected Services</h2>
              <p className="text-gray-400 mb-6">Manage your third-party integrations</p>

              {spotifyStatus.requiresAuth && (
                <div className="mb-4 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                  <p className="text-yellow-400 text-sm">
                    Please sign in to connect integrations
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {/* Spotify Integration */}
                <div className="flex items-center justify-between p-4 rounded-lg border border-slate-700/50 bg-slate-900/30">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                      <span className="text-2xl">🎵</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-white flex items-center gap-2">
                        Spotify
                        {spotifyStatus.connected && (
                          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            Connected
                          </span>
                        )}
                        {spotifyStatus.isExpired && (
                          <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">
                            Token Expired
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {spotifyStatus.connected
                          ? `Connected as ${spotifyStatus.metadata?.display_name || 'User'} • ${spotifyStatus.metadata?.product || 'free'}`
                          : 'Play music with your Sages'}
                      </p>
                      {spotifyStatus.connected && spotifyStatus.connectedAt && (
                        <p className="text-xs text-gray-500 mt-1">
                          Connected {new Date(spotifyStatus.connectedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    {spotifyStatus.connected ? (
                      <Button
                        onClick={handleDisconnectSpotify}
                        disabled={loadingSpotify}
                        variant="outline"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                      >
                        {loadingSpotify ? 'Disconnecting...' : 'Disconnect'}
                      </Button>
                    ) : (
                      <Button
                        onClick={handleConnectSpotify}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                      >
                        Connect Spotify
                      </Button>
                    )}
                  </div>
                </div>

                {/* Coming Soon Integrations */}
                <div className="space-y-4 opacity-50 pointer-events-none">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-slate-700/50 bg-slate-900/30">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                        <span className="text-2xl">📅</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-white">Google Calendar</h3>
                        <p className="text-sm text-gray-400">Schedule sage sessions</p>
                      </div>
                    </div>
                    <span className="text-xs bg-slate-700/50 text-slate-400 px-2 py-1 rounded">Coming Soon</span>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border border-slate-700/50 bg-slate-900/30">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center">
                        <span className="text-2xl">📝</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-white">Notion</h3>
                        <p className="text-sm text-gray-400">Export insights & artifacts</p>
                      </div>
                    </div>
                    <span className="text-xs bg-slate-700/50 text-slate-400 px-2 py-1 rounded">Coming Soon</span>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Adaptive Mode Tab - AI Suggestions Console */}
          <TabsContent value="adaptive" className="space-y-6">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-purple-400" />
                    Adaptive Mode: AI Suggestions
                  </h2>
                  <p className="text-gray-400 mt-2">
                    SageSpace learns how you work and suggests personalized improvements. You control what changes.
                  </p>
                </div>
                <Button
                  onClick={triggerAnalysis}
                  disabled={analyzingBehavior}
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
                >
                  {analyzingBehavior ? (
                    <>
                      <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Analyze My Behavior
                    </>
                  )}
                </Button>
              </div>

              {/* Design Karma Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-900/50 rounded-lg p-4 border border-purple-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm text-gray-400">Karma Points</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{designKarma.karmaPoints}</p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4 border border-cyan-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-cyan-400" />
                    <span className="text-sm text-gray-400">Architect Level</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{designKarma.architectLevel}</p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4 border border-green-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-green-400" />
                    <span className="text-sm text-gray-400">Review Streak</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{designKarma.reviewStreak} days</p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4 border border-pink-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="w-5 h-5 text-pink-400" />
                    <span className="text-sm text-gray-400">Reviewed</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{designKarma.proposalsReviewed}</p>
                </div>
              </div>

              {/* AI Proposals List */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Info className="w-5 h-5 text-cyan-400" />
                  Pending Suggestions ({aiProposals.length})
                </h3>

                {loadingProposals ? (
                  <div className="text-center py-8">
                    <Sparkles className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-2" />
                    <p className="text-gray-400">Loading suggestions...</p>
                  </div>
                ) : aiProposals.length === 0 ? (
                  <div className="text-center py-8 bg-slate-900/30 rounded-lg border border-slate-700/50">
                    <Sparkles className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400 mb-2">No suggestions yet</p>
                    <p className="text-sm text-gray-500">
                      Use the platform more, then click "Analyze My Behavior" to get personalized suggestions
                    </p>
                  </div>
                ) : (
                  aiProposals.map((proposal) => (
                    <div
                      key={proposal.id}
                      className="bg-slate-900/50 rounded-lg border border-slate-700/50 p-5 hover:border-cyan-500/30 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-lg font-semibold text-white">{proposal.title}</h4>
                            <span className={`text-xs px-2 py-1 rounded-full border ${getImpactBadge(proposal.impactLevel)}`}>
                              {proposal.impactLevel} impact
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm mb-2">{proposal.description}</p>
                          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded p-3 mb-3">
                            <p className="text-sm text-cyan-300 flex items-center gap-2">
                              <TrendingUp className="w-4 h-4" />
                              <span className="font-semibold">Expected Benefit:</span> {proposal.expectedBenefit}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* AI Reasoning - Collapsible */}
                      <details className="mb-4">
                        <summary className="text-sm text-purple-400 cursor-pointer hover:text-purple-300 flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          Why AI recommended this
                        </summary>
                        <p className="text-sm text-gray-400 mt-2 pl-6 border-l-2 border-purple-500/30 ml-2">
                          {proposal.aiReasoning}
                        </p>
                      </details>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-3">
                        <Button
                          onClick={() => approveProposal(proposal.id)}
                          className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white flex-1"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Approve & Apply
                        </Button>
                        <Button
                          onClick={() => rejectProposal(proposal.id)}
                          variant="outline"
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10 flex-1"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Info Box */}
              <div className="mt-6 bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-purple-300 mb-1">How Adaptive Mode Works</h4>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• AI analyzes your navigation, usage patterns, and preferences</li>
                      <li>• Suggestions are filtered through safety and compliance checks</li>
                      <li>• You review and approve all changes - nothing happens automatically</li>
                      <li>• Earn Karma Points and level up your Architect status by reviewing proposals</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
