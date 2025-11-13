"use client"

import { useState } from "react"
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
                <span className="text-sm text-gray-300">Saved successfully</span>
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

          {/* Other tabs would follow similar patterns */}
        </Tabs>
      </div>
    </div>
  )
}
