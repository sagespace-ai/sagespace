'use client'

import { useState, useEffect } from 'react'
import { use } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Heart, Share2, MessageSquare, Sparkles, Send, DollarSign, Gift, Star, Users, Eye, TrendingUp, AlertCircle, CheckCircle2, Lock, Crown, Zap, ShoppingCart, Vote } from 'lucide-react'

export default function WatchLivePage({ params }: { params: Promise<{ sessionId: string }> }) {
  const resolvedParams = use(params)
  const sessionId = resolvedParams.sessionId
  
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(1247)
  const [viewers, setViewers] = useState(3542)
  const [messages, setMessages] = useState<Array<{ id: string; username: string; text: string; isCreator?: boolean; isSage?: boolean; isPriority?: boolean }>>([
    { id: '1', username: 'TechFan42', text: 'This is amazing!' },
    { id: '2', username: 'Creator', text: 'Thanks for joining everyone!', isCreator: true },
    { id: '3', username: 'Sage Twin', text: 'Great question! Let me explain...', isSage: true },
  ])
  const [newMessage, setNewMessage] = useState('')
  const [tipAmount, setTipAmount] = useState('5')
  const [questionText, setQuestionText] = useState('')

  useEffect(() => {
    // Simulate viewer count updates
    const interval = setInterval(() => {
      setViewers(prev => prev + Math.floor(Math.random() * 10) - 4)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const toggleLike = () => {
    setLiked(!liked)
    setLikes(prev => liked ? prev - 1 : prev + 1)
  }

  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, {
        id: Date.now().toString(),
        username: 'You',
        text: newMessage
      }])
      setNewMessage('')
    }
  }

  const sendTip = () => {
    console.log('[v0] Sending tip:', tipAmount)
    // Would integrate with Stripe here
  }

  const askPriorityQuestion = () => {
    console.log('[v0] Asking priority question:', questionText)
    // Would process payment and submit question
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-balance">Product Launch Q&A Session</h1>
                <p className="text-sm text-muted-foreground">with Creator & Sage Twin</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 border border-destructive/30">
                <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                <span className="text-sm font-semibold text-destructive">LIVE</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Eye className="h-4 w-4" />
                <span>{viewers.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player Area */}
          <div className="lg:col-span-2 space-y-4">
            {/* Video */}
            <Card className="relative overflow-hidden bg-black border-border/50">
              <div className="aspect-video bg-gradient-to-br from-purple-900/30 to-black flex items-center justify-center">
                <div className="text-center">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-12 w-12 text-accent animate-pulse-slow" />
                  </div>
                  <p className="text-lg font-semibold text-balance">Live Stream in Progress</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Video player would display WebRTC stream here
                  </p>
                </div>

                {/* Live Indicators */}
                <div className="absolute top-4 left-4 space-y-2">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/80 backdrop-blur-xl border border-accent/30">
                    <Eye className="h-4 w-4 text-accent" />
                    <span className="text-sm font-semibold">{viewers.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/80 backdrop-blur-xl border border-accent/30">
                    <Heart className="h-4 w-4 text-accent" />
                    <span className="text-sm font-semibold">{likes.toLocaleString()}</span>
                  </div>
                </div>

                {/* Sage Twin Indicator */}
                <div className="absolute top-4 right-4 px-3 py-2 rounded-lg bg-black/80 backdrop-blur-xl border border-accent/30">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-accent" />
                    <span className="text-sm font-semibold">Sage Twin Active</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Interaction Bar */}
            <Card className="p-4 bg-gradient-to-br from-card/80 to-card/50 backdrop-blur-xl border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button 
                    variant={liked ? "default" : "outline"}
                    size="sm"
                    onClick={toggleLike}
                    className={liked ? "bg-gradient-to-r from-pink-500 to-red-500" : ""}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${liked ? 'fill-current' : ''}`} />
                    {likes.toLocaleString()}
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="border-accent/30">
                        <Sparkles className="h-4 w-4 mr-2 text-accent" />
                        Ask Sage
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-card/95 backdrop-blur-xl border-accent/20">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-accent" />
                          Ask the Sage Twin
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Your Question</Label>
                          <textarea 
                            className="w-full px-3 py-2 rounded-md bg-background border border-input min-h-24"
                            placeholder="What would you like to ask the Sage Twin?"
                            value={questionText}
                            onChange={(e) => setQuestionText(e.target.value)}
                          />
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-accent/10 border border-accent/20">
                          <div className="flex items-center gap-2">
                            <Crown className="h-5 w-5 text-accent" />
                            <span className="text-sm font-semibold">Priority Question - $2.99</span>
                          </div>
                          <Button 
                            className="bg-gradient-to-r from-accent to-primary"
                            onClick={askPriorityQuestion}
                          >
                            Ask Now
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Priority questions are answered first by the Sage Twin during the live session
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-gradient-to-r from-accent to-primary">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Send Tip
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card/95 backdrop-blur-xl border-accent/20">
                    <DialogHeader>
                      <DialogTitle>Send a Tip</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-2">
                        {['5', '10', '20'].map((amount) => (
                          <Button
                            key={amount}
                            variant={tipAmount === amount ? "default" : "outline"}
                            onClick={() => setTipAmount(amount)}
                          >
                            ${amount}
                          </Button>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <Label>Custom Amount</Label>
                        <Input 
                          type="number"
                          value={tipAmount}
                          onChange={(e) => setTipAmount(e.target.value)}
                          placeholder="Enter amount"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Message (optional)</Label>
                        <Input placeholder="Add a message with your tip..." />
                      </div>
                      <Button 
                        className="w-full bg-gradient-to-r from-accent to-primary"
                        onClick={sendTip}
                      >
                        <DollarSign className="h-4 w-4 mr-2" />
                        Send ${tipAmount} Tip
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </Card>

            {/* Sage Cards (Digital Collectibles) */}
            <Card className="p-6 bg-gradient-to-br from-card/80 to-card/50 backdrop-blur-xl border-border/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Star className="h-5 w-5 text-accent" />
                  Limited Edition Sage Cards
                </h3>
                <span className="text-sm text-muted-foreground">Available during live session</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: 'Launch Day Card', rarity: 'Legendary', price: '19.99', remaining: 15, total: 100 },
                  { name: 'Early Supporter', rarity: 'Epic', price: '9.99', remaining: 47, total: 500 },
                  { name: 'Community Member', rarity: 'Rare', price: '4.99', remaining: 234, total: 1000 },
                ].map((card, i) => (
                  <Card key={i} className="p-4 bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20">
                    <div className="aspect-square rounded-lg bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center mb-3">
                      <Star className="h-12 w-12 text-accent" />
                    </div>
                    <h4 className="font-semibold mb-1">{card.name}</h4>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded text-xs border ${
                        card.rarity === 'Legendary' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' :
                        card.rarity === 'Epic' ? 'bg-purple-500/10 text-purple-500 border-purple-500/30' :
                        'bg-blue-500/10 text-blue-500 border-blue-500/30'
                      }`}>
                        {card.rarity}
                      </span>
                      <span className="text-xs text-muted-foreground">{card.remaining}/{card.total} left</span>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-accent to-primary" size="sm">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Buy ${card.price}
                    </Button>
                  </Card>
                ))}
              </div>
            </Card>

            {/* Active Poll */}
            <Card className="p-6 bg-gradient-to-br from-card/80 to-card/50 backdrop-blur-xl border-border/50">
              <div className="flex items-center gap-2 mb-4">
                <Vote className="h-5 w-5 text-accent" />
                <h3 className="text-lg font-semibold">Live Poll</h3>
                <span className="px-2 py-1 rounded bg-accent/10 text-xs text-accent">Active</span>
              </div>
              <p className="mb-4">Which feature are you most excited about?</p>
              <div className="space-y-2">
                {[
                  { option: 'AI Integration', votes: 245, percentage: 45 },
                  { option: 'Live Streaming', votes: 189, percentage: 35 },
                  { option: 'Digital Collectibles', votes: 108, percentage: 20 },
                ].map((item, i) => (
                  <button
                    key={i}
                    className="w-full text-left p-3 rounded-lg bg-background/50 border border-border/50 hover:border-accent/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{item.option}</span>
                      <span className="text-sm text-muted-foreground">{item.votes} votes</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-accent to-primary"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Chat Sidebar */}
          <div className="space-y-4">
            {/* Session Info */}
            <Card className="p-4 bg-gradient-to-br from-card/80 to-card/50 backdrop-blur-xl border-border/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-accent to-primary" />
                <div>
                  <h3 className="font-semibold">Creator Name</h3>
                  <p className="text-sm text-muted-foreground">2.5K followers</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <Users className="h-4 w-4 mr-2" />
                Follow
              </Button>
            </Card>

            {/* Chat */}
            <Card className="bg-gradient-to-br from-card/80 to-card/50 backdrop-blur-xl border-border/50">
              <Tabs defaultValue="chat" className="h-full flex flex-col">
                <TabsList className="w-full border-b border-border/50 rounded-none bg-transparent">
                  <TabsTrigger value="chat" className="flex-1">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat
                  </TabsTrigger>
                  <TabsTrigger value="info" className="flex-1">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Info
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="chat" className="flex-1 flex flex-col p-0 m-0">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-96">
                    {messages.map((msg) => (
                      <div key={msg.id} className="flex items-start gap-2">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                          msg.isSage ? 'bg-gradient-to-br from-accent to-primary text-white' :
                          msg.isCreator ? 'bg-gradient-to-br from-primary to-accent text-white' :
                          'bg-muted'
                        }`}>
                          {msg.isSage ? <Sparkles className="h-4 w-4" /> :
                           msg.isCreator ? <Crown className="h-4 w-4" /> :
                           msg.username.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold">{msg.username}</span>
                            {msg.isCreator && (
                              <span className="px-1.5 py-0.5 rounded text-xs bg-primary/20 text-primary border border-primary/30">
                                Creator
                              </span>
                            )}
                            {msg.isSage && (
                              <span className="px-1.5 py-0.5 rounded text-xs bg-accent/20 text-accent border border-accent/30">
                                Sage Twin
                              </span>
                            )}
                            {msg.isPriority && (
                              <span className="px-1.5 py-0.5 rounded text-xs bg-yellow-500/20 text-yellow-500 border border-yellow-500/30">
                                Priority
                              </span>
                            )}
                          </div>
                          <p className="text-sm mt-1 break-words">{msg.text}</p>
                        </div>
                      </div>
                    ))}
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
                    <p className="text-xs text-muted-foreground mt-2">
                      Be respectful and follow community guidelines
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="info" className="flex-1 p-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">About This Session</h4>
                      <p className="text-sm text-muted-foreground">
                        Join us for an exciting product launch Q&A with our Sage Twin AI co-host!
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Session Stats</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Peak Viewers</span>
                          <span className="font-semibold">4,231</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Messages</span>
                          <span className="font-semibold">1,847</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Duration</span>
                          <span className="font-semibold">1h 23m</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>

            {/* Subscription Upsell */}
            <Card className="p-4 bg-gradient-to-br from-accent/10 to-primary/10 border-accent/20">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center flex-shrink-0">
                  <Crown className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Unlock Premium Features</h4>
                  <p className="text-xs text-muted-foreground mb-3">
                    Get priority questions, exclusive Sage Cards, and ad-free viewing
                  </p>
                  <Button size="sm" className="w-full bg-gradient-to-r from-accent to-primary">
                    Subscribe Now
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
