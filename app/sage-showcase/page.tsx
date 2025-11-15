'use client'

import { SageAvatar } from '@/components/sage-avatar/SageAvatar'
import { SageArchetype, EvolutionStage, SageEmotion } from '@/lib/sage-avatar/types'
import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

export default function SageShowcasePage() {
  const [archetype, setArchetype] = useState<SageArchetype>('dreamer')
  const [stage, setStage] = useState<EvolutionStage>(3)
  const [emotion, setEmotion] = useState<SageEmotion>('calm')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  const archetypes: SageArchetype[] = ['strategist', 'dreamer', 'warrior', 'scholar', 'shadowwalker']
  const emotions: SageEmotion[] = ['calm', 'joy', 'curious', 'confident', 'concerned', 'doubt', 'shadow']

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Sage Avatar Showcase
          </h1>
          <p className="text-lg text-muted-foreground">
            Experience the cosmic intelligence of SageSpace Sages
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Display */}
          <Card className="lg:col-span-2 bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-2 border-purple-500/20 p-12">
            <div className="flex items-center justify-center min-h-[500px]">
              <SageAvatar
                archetype={archetype}
                evolutionStage={stage}
                emotion={emotion}
                isSpeaking={isSpeaking}
                isThinking={isThinking}
                size={400}
                reduceMotion={reduceMotion}
              />
            </div>
            
            <div className="mt-8 text-center space-y-2">
              <h2 className="text-2xl font-bold capitalize">{archetype}</h2>
              <p className="text-sm text-muted-foreground">
                Evolution Stage {stage} • {emotion} • {isSpeaking ? 'Speaking' : isThinking ? 'Thinking' : 'Idle'}
              </p>
            </div>
          </Card>

          {/* Controls */}
          <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-2 border-cyan-500/20 p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Controls</h3>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-sm mb-2 block">Archetype</Label>
                  <Select value={archetype} onValueChange={(v) => setArchetype(v as SageArchetype)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {archetypes.map((arch) => (
                        <SelectItem key={arch} value={arch} className="capitalize">
                          {arch}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm mb-2 block">Evolution Stage</Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map((s) => (
                      <Button
                        key={s}
                        variant={stage === s ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setStage(s as EvolutionStage)}
                      >
                        {s}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm mb-2 block">Emotion</Label>
                  <Select value={emotion} onValueChange={(v) => setEmotion(v as SageEmotion)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {emotions.map((emo) => (
                        <SelectItem key={emo} value={emo} className="capitalize">
                          {emo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="speaking">Speaking</Label>
                  <Switch
                    id="speaking"
                    checked={isSpeaking}
                    onCheckedChange={setIsSpeaking}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="thinking">Thinking</Label>
                  <Switch
                    id="thinking"
                    checked={isThinking}
                    onCheckedChange={setIsThinking}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="motion">Reduce Motion</Label>
                  <Switch
                    id="motion"
                    checked={reduceMotion}
                    onCheckedChange={setReduceMotion}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* All Archetypes Grid */}
        <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-2 border-pink-500/20 p-8">
          <h3 className="text-2xl font-bold mb-6 text-center">All Archetypes</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {archetypes.map((arch) => (
              <div key={arch} className="text-center space-y-4">
                <div
                  className="cursor-pointer transition-transform hover:scale-110"
                  onClick={() => setArchetype(arch)}
                >
                  <SageAvatar
                    archetype={arch}
                    evolutionStage={3}
                    emotion="calm"
                    size={150}
                  />
                </div>
                <p className="text-sm font-medium capitalize">{arch}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Evolution Stages */}
        <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-2 border-purple-500/20 p-8">
          <h3 className="text-2xl font-bold mb-6 text-center">Evolution Stages</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="text-center space-y-4">
                <SageAvatar
                  archetype="dreamer"
                  evolutionStage={s as EvolutionStage}
                  emotion="joy"
                  size={150}
                />
                <p className="text-sm font-medium">Stage {s}</p>
                <p className="text-xs text-muted-foreground">
                  {s === 1 && 'Embers of Form'}
                  {s === 2 && 'Awakened'}
                  {s === 3 && 'Ascendant'}
                  {s === 4 && 'Cosmic Sovereign'}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
