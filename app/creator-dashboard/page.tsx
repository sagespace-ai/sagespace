'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sparkles, Video, Calendar, BarChart3, Settings, Users, DollarSign, Radio, Instagram, Youtube, Twitch, Play, Pause, Eye, MessageSquare, Heart, TrendingUp, Shield, Mic, ImageIcon, Clock, CheckCircle2, AlertCircle, Zap } from 'lucide-react'

export default function CreatorDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [sageTwinName, setSageTwinName] = useState('')
  const [isLive, setIsLive] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-8 w-8 text-accent" />
                <h1 className="text-2xl font-bold text-balance">Creator Studio</h1>
              </div>
              {isLive && (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 border border-destructive/30">
                  <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                  <span className="text-sm font-semibold text-destructive">LIVE</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-accent/80 to-primary/80 hover:from-accent hover:to-primary">
                <Play className="h-4 w-4 mr-2" />
                Go Live
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          {/* Navigation */}
          <TabsList className="bg-card/50 backdrop-blur-xl border border-border/50 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-accent/20">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="sage-twin" className="data-[state=active]:bg-accent/20">
              <Sparkles className="h-4 w-4 mr-2" />
              Sage Twin
            </TabsTrigger>
            <TabsTrigger value="sessions" className="data-[state=active]:bg-accent/20">
              <Calendar className="h-4 w-4 mr-2" />
              Sessions
            </TabsTrigger>
            <TabsTrigger value="platforms" className="data-[state=active]:bg-accent/20">
              <Radio className="h-4 w-4 mr-2" />
              Platforms
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-accent/20">
              <TrendingUp className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="revenue" className="data-[state=active]:bg-accent/20">
              <DollarSign className="h-4 w-4 mr-2" />
              Revenue
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-6 bg-gradient-to-br from-card/80 to-card/50 backdrop-blur-xl border-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Sessions</p>
                    <p className="text-3xl font-bold mt-1">24</p>
                    <p className="text-xs text-primary mt-1">+12% this month</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Video className="h-6 w-6 text-accent" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-card/80 to-card/50 backdrop-blur-xl border-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Viewers</p>
                    <p className="text-3xl font-bold mt-1">12.5K</p>
                    <p className="text-xs text-primary mt-1">+28% this month</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-accent" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-card/80 to-card/50 backdrop-blur-xl border-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Engagement Rate</p>
                    <p className="text-3xl font-bold mt-1">87%</p>
                    <p className="text-xs text-primary mt-1">+5% this month</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Heart className="h-6 w-6 text-accent" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-card/80 to-card/50 backdrop-blur-xl border-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-3xl font-bold mt-1">$4.2K</p>
                    <p className="text-xs text-primary mt-1">+35% this month</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-accent" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="p-6 bg-gradient-to-br from-card/80 to-card/50 backdrop-blur-xl border-border/50">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="h-auto flex-col items-start p-4 bg-gradient-to-br from-accent/10 to-accent/5 hover:from-accent/20 hover:to-accent/10 border-accent/20">
                  <Play className="h-6 w-6 mb-2 text-accent" />
                  <span className="font-semibold">Start Live Session</span>
                  <span className="text-xs text-muted-foreground mt-1">Go live with your Sage Twin</span>
                </Button>
                <Button className="h-auto flex-col items-start p-4 bg-gradient-to-br from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 border-primary/20">
                  <Calendar className="h-6 w-6 mb-2 text-primary" />
                  <span className="font-semibold">Schedule Session</span>
                  <span className="text-xs text-muted-foreground mt-1">Plan your next broadcast</span>
                </Button>
                <Button className="h-auto flex-col items-start p-4 bg-gradient-to-br from-secondary/10 to-secondary/5 hover:from-secondary/20 hover:to-secondary/10 border-secondary/20">
                  <Sparkles className="h-6 w-6 mb-2" />
                  <span className="font-semibold">Train Sage Twin</span>
                  <span className="text-xs text-muted-foreground mt-1">Update AI personality</span>
                </Button>
              </div>
            </Card>

            {/* Upcoming Sessions */}
            <Card className="p-6 bg-gradient-to-br from-card/80 to-card/50 backdrop-blur-xl border-border/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Upcoming Sessions</h3>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-background/50 border border-border/50">
                    <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-accent" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Product Launch Q&A Session {i}</h4>
                      <p className="text-sm text-muted-foreground">Tomorrow at 3:00 PM PST</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-muted-foreground">Multi-platform</div>
                      <Button size="sm" variant="outline">Edit</Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Sage Twin Builder Tab */}
          <TabsContent value="sage-twin" className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-card/80 to-card/50 backdrop-blur-xl border-border/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Sage Twin Builder</h2>
                  <p className="text-sm text-muted-foreground">Create your AI co-host personality</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-accent" />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="twin-name">Sage Twin Name</Label>
                      <Input 
                        id="twin-name"
                        placeholder="e.g., Nova, Sage Alex, Digital Echo"
                        value={sageTwinName}
                        onChange={(e) => setSageTwinName(e.target.value)}
                        className="bg-background/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="response-tone">Response Tone</Label>
                      <select 
                        id="response-tone"
                        className="w-full px-3 py-2 rounded-md bg-background/50 border border-input text-sm"
                      >
                        <option>Balanced</option>
                        <option>Professional</option>
                        <option>Casual</option>
                        <option>Energetic</option>
                        <option>Witty</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description"
                      placeholder="Describe your Sage Twin's personality, expertise, and speaking style..."
                      rows={4}
                      className="bg-background/50"
                    />
                  </div>
                </div>

                {/* Voice & Avatar */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Mic className="h-5 w-5 text-accent" />
                    Voice & Avatar
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4 bg-background/30 border-border/50">
                      <div className="flex items-center gap-3 mb-3">
                        <Mic className="h-5 w-5 text-accent" />
                        <h4 className="font-semibold">Voice Sample</h4>
                      </div>
                      <div className="space-y-3">
                        <Button variant="outline" className="w-full">
                          Upload Voice Recording
                        </Button>
                        <p className="text-xs text-muted-foreground">
                          Upload a 30-60 second voice sample for AI voice cloning
                        </p>
                        <div className="flex items-center gap-2 text-sm">
                          <input type="checkbox" id="voice-license" className="rounded" />
                          <Label htmlFor="voice-license" className="text-xs">
                            I acknowledge voice licensing rights
                          </Label>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4 bg-background/30 border-border/50">
                      <div className="flex items-center gap-3 mb-3">
                        <ImageIcon className="h-5 w-5 text-accent" />
                        <h4 className="font-semibold">Avatar</h4>
                      </div>
                      <div className="space-y-3">
                        <Button variant="outline" className="w-full">
                          Upload Avatar Image
                        </Button>
                        <p className="text-xs text-muted-foreground">
                          Upload a profile image or 3D avatar for your Sage Twin
                        </p>
                        <div className="flex items-center gap-2 text-sm">
                          <input type="checkbox" id="avatar-license" className="rounded" />
                          <Label htmlFor="avatar-license" className="text-xs">
                            I acknowledge avatar licensing rights
                          </Label>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                {/* Personality Traits */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Zap className="h-5 w-5 text-accent" />
                    Personality Traits
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['Empathetic', 'Humorous', 'Analytical', 'Creative', 'Supportive', 'Direct', 'Thoughtful', 'Playful'].map((trait) => (
                      <Button
                        key={trait}
                        variant="outline"
                        className="justify-start bg-background/30"
                      >
                        {trait}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Compliance Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Shield className="h-5 w-5 text-accent" />
                    Compliance & Safety
                  </h3>
                  <Card className="p-4 bg-background/30 border-border/50">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">Content Filter Level</h4>
                          <p className="text-sm text-muted-foreground">Control response filtering</p>
                        </div>
                        <select className="px-3 py-2 rounded-md bg-background border border-input text-sm">
                          <option>Moderate</option>
                          <option>Strict</option>
                          <option>Relaxed</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">Human Approval Required</h4>
                          <p className="text-sm text-muted-foreground">Review responses before broadcasting</p>
                        </div>
                        <input type="checkbox" className="h-5 w-5 rounded" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">Safe Mode</h4>
                          <p className="text-sm text-muted-foreground">Extra content moderation layer</p>
                        </div>
                        <input type="checkbox" defaultChecked className="h-5 w-5 rounded" />
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Training Status */}
                <Card className="p-4 bg-gradient-to-r from-accent/10 to-primary/10 border-accent/20">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                    <div className="flex-1">
                      <h4 className="font-semibold">Training Status: Ready</h4>
                      <p className="text-sm text-muted-foreground">Your Sage Twin is ready for live sessions</p>
                    </div>
                    <Button className="bg-gradient-to-r from-accent to-primary">
                      Test Sage Twin
                    </Button>
                  </div>
                </Card>

                {/* Save Button */}
                <div className="flex justify-end gap-3">
                  <Button variant="outline">Reset</Button>
                  <Button className="bg-gradient-to-r from-accent to-primary">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Save Sage Twin
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Sessions Tab */}
          <TabsContent value="sessions" className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-card/80 to-card/50 backdrop-blur-xl border-border/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Live Sessions</h2>
                <Button className="bg-gradient-to-r from-accent to-primary">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule New Session
                </Button>
              </div>

              <Tabs defaultValue="upcoming" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="past">Past</TabsTrigger>
                  <TabsTrigger value="drafts">Drafts</TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming" className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="p-4 bg-background/30 border-border/50">
                      <div className="flex items-start gap-4">
                        <div className="h-20 w-32 rounded-lg bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                          <Play className="h-8 w-8 text-accent" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">Product Launch Event {i}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              Tomorrow, 3:00 PM PST
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              Estimated 2.5K viewers
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="px-2 py-1 rounded bg-accent/10 text-xs text-accent border border-accent/20">Instagram</div>
                            <div className="px-2 py-1 rounded bg-accent/10 text-xs text-accent border border-accent/20">YouTube</div>
                            <div className="px-2 py-1 rounded bg-accent/10 text-xs text-accent border border-accent/20">Twitch</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="sm">Cancel</Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="past">
                  <p className="text-center text-muted-foreground py-8">Past sessions will appear here</p>
                </TabsContent>

                <TabsContent value="drafts">
                  <p className="text-center text-muted-foreground py-8">Draft sessions will appear here</p>
                </TabsContent>
              </Tabs>
            </Card>
          </TabsContent>

          {/* Platforms Tab */}
          <TabsContent value="platforms" className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-card/80 to-card/50 backdrop-blur-xl border-border/50">
              <h2 className="text-2xl font-bold mb-6">Connected Platforms</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Instagram */}
                <Card className="p-6 bg-background/30 border-border/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                        <Instagram className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Instagram Live</h3>
                        <p className="text-sm text-muted-foreground">Not connected</p>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">Connect Instagram</Button>
                </Card>

                {/* TikTok */}
                <Card className="p-6 bg-background/30 border-border/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-400 to-pink-400 flex items-center justify-center">
                        <Video className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold">TikTok Live</h3>
                        <p className="text-sm text-muted-foreground">Not connected</p>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">Connect TikTok</Button>
                </Card>

                {/* YouTube */}
                <Card className="p-6 bg-background/30 border-border/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                        <Youtube className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold">YouTube Live</h3>
                        <p className="text-sm text-primary">Connected</p>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full border-destructive/50 text-destructive hover:bg-destructive/10">
                    Disconnect
                  </Button>
                </Card>

                {/* Twitch */}
                <Card className="p-6 bg-background/30 border-border/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                        <Twitch className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Twitch</h3>
                        <p className="text-sm text-muted-foreground">Not connected</p>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">Connect Twitch</Button>
                </Card>
              </div>

              {/* RTMP Configuration */}
              <Card className="p-6 bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20 mt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Radio className="h-5 w-5 text-accent" />
                  RTMP Stream Configuration
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>RTMP Server URL</Label>
                    <Input 
                      value="rtmp://live.sagespace.ai/live"
                      readOnly
                      className="bg-background/50 font-mono text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Stream Key</Label>
                    <div className="flex gap-2">
                      <Input 
                        value="sk_live_••••••••••••••••"
                        readOnly
                        className="bg-background/50 font-mono text-sm"
                      />
                      <Button variant="outline">Regenerate</Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Use these credentials in your streaming software (OBS, Streamlabs, etc.) to broadcast to multiple platforms simultaneously
                  </p>
                </div>
              </Card>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-card/80 to-card/50 backdrop-blur-xl border-border/50">
              <h2 className="text-2xl font-bold mb-6">Analytics & Insights</h2>
              <p className="text-muted-foreground">Detailed analytics coming soon...</p>
            </Card>
          </TabsContent>

          {/* Revenue Tab */}
          <TabsContent value="revenue" className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-card/80 to-card/50 backdrop-blur-xl border-border/50">
              <h2 className="text-2xl font-bold mb-6">Revenue Dashboard</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="p-4 bg-background/30 border-border/50">
                  <p className="text-sm text-muted-foreground mb-1">Total Earnings</p>
                  <p className="text-2xl font-bold">$4,287.50</p>
                  <p className="text-xs text-primary mt-1">+15% from last month</p>
                </Card>
                <Card className="p-4 bg-background/30 border-border/50">
                  <p className="text-sm text-muted-foreground mb-1">This Month</p>
                  <p className="text-2xl font-bold">$1,245.00</p>
                  <p className="text-xs text-primary mt-1">12 sessions</p>
                </Card>
                <Card className="p-4 bg-background/30 border-border/50">
                  <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
                  <p className="text-2xl font-bold">$845.30</p>
                  <Button size="sm" className="mt-2">Withdraw</Button>
                </Card>
              </div>

              <Card className="p-4 bg-background/30 border-border/50">
                <h3 className="font-semibold mb-4">Revenue Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tips & Donations</span>
                    <span className="font-semibold">$2,450.00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sage Cards Sales</span>
                    <span className="font-semibold">$1,200.00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Priority Questions</span>
                    <span className="font-semibold">$637.50</span>
                  </div>
                </div>
              </Card>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
