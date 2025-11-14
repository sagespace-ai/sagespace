'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, BookOpen, Sparkles } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

export default function GuidePage() {
  const [sections, setSections] = useState<any[]>([])
  const [selectedSection, setSelectedSection] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchGuide()
  }, [])

  const fetchGuide = async () => {
    try {
      const response = await fetch('/api/guide')
      const data = await response.json()
      setSections(data.sections || [])
      if (data.sections?.length > 0) {
        setSelectedSection(data.sections[0])
      }
    } catch (error) {
      console.error('[v0] Error fetching guide:', error)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchGuide()
      return
    }

    try {
      const response = await fetch(`/api/guide/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      setSections(data.results || [])
    } catch (error) {
      console.error('[v0] Error searching guide:', error)
    }
  }

  const categories = {
    'getting-started': 'Getting Started',
    'features': 'Features',
    'advanced': 'Advanced',
    'reference': 'Reference'
  }

  const groupedSections = Object.entries(categories).map(([key, label]) => ({
    category: key,
    label,
    sections: sections.filter(s => s.category === key)
  }))

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            SageSpace Guide
          </h1>
          <p className="text-gray-400">Your comprehensive guide to cosmic AI mastery</p>
        </div>

        {/* Search */}
        <div className="mb-8 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search the guide..."
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch}>Search</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-4 bg-black/40 border-purple-500/20">
              {groupedSections.map(group => (
                group.sections.length > 0 && (
                  <div key={group.category} className="mb-6 last:mb-0">
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">{group.label}</h3>
                    <div className="space-y-1">
                      {group.sections.map(section => (
                        <button
                          key={section.id}
                          onClick={() => setSelectedSection(section)}
                          className={`
                            w-full text-left px-3 py-2 rounded text-sm transition-colors
                            ${selectedSection?.id === section.id 
                              ? 'bg-purple-500/20 text-purple-300' 
                              : 'hover:bg-purple-500/10 text-gray-300'}
                          `}
                        >
                          {section.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </Card>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {selectedSection ? (
              <Card className="p-8 bg-black/40 border-purple-500/20">
                <div className="flex items-center gap-2 mb-6">
                  <BookOpen className="w-6 h-6 text-purple-400" />
                  <h2 className="text-3xl font-bold">{selectedSection.title}</h2>
                </div>
                <div className="prose prose-invert prose-purple max-w-none">
                  <ReactMarkdown>{selectedSection.content}</ReactMarkdown>
                </div>
                <div className="mt-8 pt-6 border-t border-purple-500/20 text-sm text-gray-400">
                  Last updated: {new Date(selectedSection.lastUpdated).toLocaleDateString()}
                  {selectedSection.version && ` • Version ${selectedSection.version}`}
                </div>
              </Card>
            ) : (
              <Card className="p-8 bg-black/40 border-purple-500/20 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <p className="text-gray-400">Select a guide section to begin</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
