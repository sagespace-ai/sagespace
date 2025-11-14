'use client'

import { use, useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles, Lock, CheckCircle } from 'lucide-react'

export default function SkillTreePage({ params }: { params: Promise<{ sageId: string }> }) {
  const { sageId } = use(params)
  const [skills, setSkills] = useState<any[]>([])
  const [selectedSkill, setSelectedSkill] = useState<any>(null)

  useEffect(() => {
    // Fetch skill tree for sage
    fetchSkillTree()
  }, [sageId])

  const fetchSkillTree = async () => {
    try {
      const response = await fetch(`/api/skills/${sageId}`)
      const data = await response.json()
      setSkills(data.skills || [])
    } catch (error) {
      console.error('[v0] Error fetching skill tree:', error)
    }
  }

  const unlockSkill = async (skillId: string) => {
    try {
      await fetch(`/api/skills/${sageId}/unlock`, {
        method: 'POST',
        body: JSON.stringify({ skillId })
      })
      fetchSkillTree() // Refresh
    } catch (error) {
      console.error('[v0] Error unlocking skill:', error)
    }
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Sage Skill Tree
        </h1>
        <p className="text-gray-400 mb-8">Train your Sage to unlock new abilities and improve performance</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Skill Tree Visualization */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-black/40 border-purple-500/20">
              <h2 className="text-xl font-semibold mb-4">Skill Constellation</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {skills.map((skill) => (
                  <SkillCard
                    key={skill.id}
                    skill={skill}
                    onSelect={() => setSelectedSkill(skill)}
                    onUnlock={() => unlockSkill(skill.id)}
                  />
                ))}
              </div>
            </Card>
          </div>

          {/* Skill Details Panel */}
          <div className="lg:col-span-1">
            {selectedSkill ? (
              <Card className="p-6 bg-black/40 border-purple-500/20">
                <h3 className="text-2xl font-bold mb-2">{selectedSkill.name}</h3>
                <p className="text-sm text-gray-400 mb-4">Level {selectedSkill.level}/{selectedSkill.maxLevel}</p>
                <p className="text-gray-300 mb-4">{selectedSkill.description}</p>
                
                <div className="space-y-3 mb-4">
                  <h4 className="font-semibold text-sm">Benefits:</h4>
                  {selectedSkill.benefits?.map((benefit: any, i: number) => (
                    <div key={i} className="text-sm text-gray-400 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-purple-400 mt-0.5" />
                      <span>{benefit.description}</span>
                    </div>
                  ))}
                </div>

                {!selectedSkill.unlocked && (
                  <Button 
                    onClick={() => unlockSkill(selectedSkill.id)}
                    className="w-full"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Unlock ({selectedSkill.xpRequired} XP)
                  </Button>
                )}
              </Card>
            ) : (
              <Card className="p-6 bg-black/40 border-purple-500/20 flex items-center justify-center h-full">
                <p className="text-gray-500">Select a skill to view details</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function SkillCard({ skill, onSelect, onUnlock }: any) {
  return (
    <button
      onClick={onSelect}
      className={`
        p-4 rounded-lg border text-left transition-all
        ${skill.unlocked 
          ? 'border-purple-500/40 bg-purple-950/20 hover:border-purple-500/60' 
          : 'border-gray-700 bg-gray-900/20 opacity-60'
        }
      `}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-sm">{skill.name}</h4>
        {skill.unlocked ? (
          <CheckCircle className="w-4 h-4 text-green-400" />
        ) : (
          <Lock className="w-4 h-4 text-gray-500" />
        )}
      </div>
      <p className="text-xs text-gray-400 mb-2">Level {skill.level}/{skill.maxLevel}</p>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
          style={{ width: `${(skill.level / skill.maxLevel) * 100}%` }}
        />
      </div>
    </button>
  )
}
