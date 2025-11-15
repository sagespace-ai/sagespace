'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Video, VideoOff, Mic, MicOff, Monitor, Settings, Users, MessageSquare, BarChart, Sparkles, Send, Pin, Heart, DollarSign, Play, Pause, Radio, AlertCircle, CheckCircle2, TrendingUp, Eye, Clock, Zap, Volume2, VolumeX, Maximize, Minimize, MoreVertical } from 'lucide-react'
import { use } from 'react'

export default function LiveStudioPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const resolvedParams = use(params)
  const sessionId = resolvedParams.sessionId
  
  const [isLive, setIsLive] = useState(false)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [screenShareEnabled, setScreenShareEnabled] = useState(false)
  const [viewers, setViewers] = useState(0)
  const [messages, setMessages] = useState<Array<{ id: string; username: string; text: string; platform: string; isPriority?: boolean }>>([])
  const [newMessage, setNewMessage] = useState('')
  const [sageTwinActive, setSageTwinActive] = useState(true)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Initialize WebRTC
  useEffect(() => {
    async function initWebRTC() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
        streamRef.current = stream
      } catch (error) {
        console.error('[v0] Error accessing media devices:', error)
      }
    }

    initWebRTC()

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const toggleLive = () => {
    setIsLive(!isLive)
    if (!isLive) {
      setViewers(Math.floor(Math.random() * 1000) + 50)
    }
  }

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setVideoEnabled(videoTrack.enabled)
      }
    }
  }

  const toggleAudio = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setAudioEnabled(audioTrack.enabled)
      }
    }
  }

  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, {
        id: Date.now().toString(),
        username: 'You',
        text: newMessage,
        platform: 'sagespace'
      }])
      setNewMessage('')
    }
  }

  const askSageTwin = (question: string) => {
    console.log('[v0] Asking Sage Twin:', question)
    // Simulate Sage Twin response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        username: 'Sage Twin',
        text: `That's a great question! ${question}`,
        platform: 'ai'
      }])
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-balance">Live Studio</h1>
              {isLive ? (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 border border-destructive/30">
                  <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                  <span className="text-sm font-semibold text-destructive">LIVE</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/10 border border-border/30">
                  <span className="text-sm font-semibold text-muted-foreground">OFFLINE</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Eye className="h-4 w-4" />
                <span>{isLive ? viewers.toLocaleString() : '0'} viewers</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant={isLive ? "destructive" : "default"}
                onClick={toggleLive}
                className={isLive ? "" : "bg-gradient-to-r from-accent to-primary"}
              >
                {isLive ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    End Stream
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Go Live
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Area */}
          <div className="lg:col-span-2 space-y-4">
            {/* Video Feed */}
            <Card className="relative overflow-hidden bg-black border-border/50">
              <div className="aspect-video bg-gradient-to-br from-purple-950/20 to-black relative">
                <video 
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                
                {/* Sage Twin Bubble */}
                {sageTwinActive && (
                  <div className="absolute top-4 right-4 w-32 h-32 rounded-full border-2 border-accent/50 overflow-hidden bg-gradient-to-br from-accent/20 to-primary/20 backdrop-blur-xl">
                    <div className="w-full h-full flex items-center justify-center">
                      <Sparkles className="h-12 w-12 text-accent animate-pulse-slow" />
                    </div>
                    <div className="absolute bottom-2 left-0 right-0 text-center">
                      <span className="text-xs font-semibold text-white bg-black/50 px-2 py-1 rounded">Sage Twin</span>
                    </div>
                  </div>
                )}

                {/* Live Stats Overlay */}
                {isLive && (
                  <div className="absolute top-4 left-4 space-y-2">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/80 backdrop-blur-xl border border-accent/30">
                      <Eye className="h-4 w-4 text-accent" />
                      <span className="text-sm font-semibold">{viewers.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/80 backdrop-blur-xl border border-accent/30">
                      <Heart className="h-4 w-4 text-accent" />
                      <span className="text-sm font-semibold">{Math.floor(viewers * 0.7).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/80 backdrop-blur-xl border border-accent/30">
                      <Clock className="h-4 w-4 text-accent" />
                      <span className="text-sm font-semibold">00:15:23</span>
                    </div>
                  </div>
                )}

                {/* Video Controls Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant={videoEnabled ? "default" : "destructive"}
                        onClick={toggleVideo}
                        className="rounded-full"
                      >
                        {videoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                      </Button>
                      <Button 
                        size="sm" 
                        variant={audioEnabled ? "default" : "destructive"}
                        onClick={toggleAudio}
                        className="rounded-full"
                      >
                        {audioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                      </Button>
                      <Button 
                        size="sm" 
                        variant={screenShareEnabled ? "default" : "outline"}
                        onClick={() => setScreenShareEnabled(!screenShareEnabled)}
                        className="rounded-full"
                      >
                        <Monitor className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="rounded-full">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="rounded-full">
                        <Maximize className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Stream Info & Actions */}
            <Card className="p-4 bg-gradient-to-br from-card/80 to-card/50 backdrop-blur-xl border-border/50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">Product Launch Q&A Session</h3>
                  <p className="text-sm text-muted-foreground">Streaming to YouTube, Instagram, TikTok</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-sm text-muted-foreground">Multi-streaming active</span>
                </div>
              </div>

              {/* Action Panel */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Button variant="outline" className="justify-start" onClick={() => askSageTwin('What do you think?')}>
                  <Sparkles className="h-4 w-4 mr-2 text-accent" />
                  Ask Sage
                </Button>
                <Button variant="outline" className="justify-start">
                  <BarChart className="h-4 w-4 mr-2" />
                  Create Poll
                </Button>
                <Button variant="outline" className="justify-start">
                  <Pin className="h-4 w-4 mr-2" />
                  Pin Message
                </Button>
                <Button variant="outline" className="justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Highlight
                </Button>
              </div>
            </Card>

            {/* Sage Twin Control */}
            <Card className="p-4 bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Sage Twin AI Co-Host</h4>
                    <p className="text-sm text-muted-foreground">
                      {sageTwinActive ? 'Active and ready to respond' : 'Paused'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant={sageTwinActive ? "default" : "outline"}
                    onClick={() => setSageTwinActive(!sageTwinActive)}
                  >
                    {sageTwinActive ? 'Pause' : 'Resume'}
                  </Button>
                  <Button size="sm" variant="outline">
                    Settings
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar - Chat & Interaction */}
          <div className="space-y-4">
            {/* Live Stats */}
            <Card className="p-4 bg-gradient-to-br from-card/80 to-card/50 backdrop-blur-xl border-border/50">
              <h3 className="font-semibold mb-3">Live Stats</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Peak Viewers</span>
                  <span className="font-semibold">{Math.floor(viewers * 1.3).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Messages</span>
                  <span className="font-semibold">{messages.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Engagement</span>
                  <span className="font-semibold text-primary">94%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tips Today</span>
                  <span className="font-semibold text-primary">$245.50</span>
                </div>
              </div>
            </Card>

            {/* Chat Feed */}
            <Card className="bg-gradient-to-br from-card/80 to-card/50 backdrop-blur-xl border-border/50">
              <Tabs defaultValue="chat" className="h-full flex flex-col">
                <TabsList className="w-full border-b border-border/50 rounded-none bg-transparent">
                  <TabsTrigger value="chat" className="flex-1">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat
                  </TabsTrigger>
                  <TabsTrigger value="questions" className="flex-1">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Questions
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="chat" className="flex-1 flex flex-col p-0 m-0">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-96">
                    {messages.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">
                        <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No messages yet</p>
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <div key={msg.id} className="flex items-start gap-2">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                            msg.platform === 'ai' ? 'bg-gradient-to-br from-accent to-primary text-white' : 'bg-muted'
                          }`}>
                            {msg.platform === 'ai' ? <Sparkles className="h-4 w-4" /> : msg.username.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold">{msg.username}</span>
                              {msg.isPriority && (
                                <span className="px-1.5 py-0.5 rounded text-xs bg-accent/20 text-accent border border-accent/30">
                                  Priority
                                </span>
                              )}
                              <span className="text-xs text-muted-foreground">{msg.platform}</span>
                            </div>
                            <p className="text-sm mt-1">{msg.text}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-border/50">
                    <div className="flex gap-2">
                      <Input 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Send a message..."
                        className="bg-background/50"
                      />
                      <Button size="icon" onClick={sendMessage}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="questions" className="flex-1 p-4">
                  <div className="text-center text-muted-foreground py-8">
                    <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Questions will appear here</p>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>

            {/* Quick Tips */}
            <Card className="p-4 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Zap className="h-4 w-4 text-accent" />
                Pro Tips
              </h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Ask your Sage Twin to summarize key points</li>
                <li>• Create polls to boost engagement</li>
                <li>• Pin important messages for visibility</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
