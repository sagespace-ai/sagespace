"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { User, Shield, Bell, Eye, Palette, Wrench, CreditCard, ArrowLeft, Check, Sparkles } from "@/components/icons"

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

  const [spotifyStatus, setSpotifyStatus] = useState<{
    connected: boolean
    isExpired?: boolean
    metadata?: any
    connectedAt?: string
    requiresAuth?: boolean // Added requiresAuth flag
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
  }, [])

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
                    className="bg-slate-900/50 border-slate-600 text-white"
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
        </Tabs>
      </div>
    </div>
  )
}
