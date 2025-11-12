"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"

interface Setting {
  id: string
  key: string
  name?: string
  category: string
  value: string | boolean | number
  description: string
  type?: "select" | "boolean" | "number"
}

interface GovSettingsProps {
  settings: Setting[]
  onSettingChange?: (settingId: string, newValue: string | boolean | number) => void
}

export function GovernanceSettings({ settings, onSettingChange }: GovSettingsProps) {
  const [selectedSettings, setSelectedSettings] = useState<Record<string, string | boolean | number>>({})
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const handleSettingToggle = (setting: Setting) => {
    if (setting.type === "boolean") {
      const newValue = selectedSettings[setting.id] !== undefined ? !selectedSettings[setting.id] : !setting.value
      setSelectedSettings((prev) => ({ ...prev, [setting.id]: newValue }))
      onSettingChange?.(setting.id, newValue)
    } else {
      setExpandedId(expandedId === setting.id ? null : setting.id)
    }
  }

  const handleValueSelect = (settingId: string, newValue: string | number) => {
    setSelectedSettings((prev) => ({ ...prev, [settingId]: newValue }))
    onSettingChange?.(settingId, newValue)
    setExpandedId(null)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {settings.map((setting) => {
        const currentValue = selectedSettings[setting.id] !== undefined ? selectedSettings[setting.id] : setting.value
        const isSelected = selectedSettings[setting.id] !== undefined

        return (
          <div
            key={setting.id}
            className={`glass-sm border rounded-2xl p-6 transition-subtle cursor-pointer ${
              isSelected
                ? "border-cyan-400/50 bg-cyan-400/5 hover:border-cyan-400"
                : "border-border/30 hover:border-cyan-400/50"
            } group`}
            onClick={() => handleSettingToggle(setting)}
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-foreground group-hover:text-cyan-300 transition-colors">
                  {setting.name || setting.key}
                </h3>
                <p className="text-cyan-400/80 text-xs uppercase tracking-widest font-semibold">{setting.category}</p>
              </div>

              <p className="text-text-secondary text-sm">{setting.description}</p>

              <div className="space-y-3 pt-2">
                {setting.type === "boolean" ? (
                  <div className="flex items-center justify-between px-4 py-3 bg-muted/50 rounded-xl border border-border/30">
                    <span className="font-mono text-sm text-foreground">
                      {currentValue ? "✓ Enabled" : "✗ Disabled"}
                    </span>
                    <Badge
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        currentValue
                          ? "bg-cyan-400/20 text-cyan-300 border-cyan-400/30"
                          : "bg-gray-600/20 text-gray-300 border-gray-600/30"
                      } border`}
                    >
                      {currentValue ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="px-4 py-3 bg-muted/50 rounded-xl border border-border/30 font-mono text-sm text-foreground">
                      Current: {String(currentValue)}
                    </div>

                    {expandedId === setting.id && (
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        {setting.key === "theme" &&
                          ["light", "dark", "auto"].map((opt) => (
                            <button
                              key={opt}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleValueSelect(setting.id, opt)
                              }}
                              className={`px-3 py-2 rounded-lg text-xs font-medium transition-subtle border ${
                                currentValue === opt
                                  ? "bg-cyan-400/30 border-cyan-400/50 text-cyan-300"
                                  : "bg-border/20 border-border/30 text-foreground hover:border-cyan-400/30"
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        {setting.key === "fontSize" &&
                          ["small", "medium", "large"].map((opt) => (
                            <button
                              key={opt}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleValueSelect(setting.id, opt)
                              }}
                              className={`px-3 py-2 rounded-lg text-xs font-medium transition-subtle border ${
                                currentValue === opt
                                  ? "bg-cyan-400/30 border-cyan-400/50 text-cyan-300"
                                  : "bg-border/20 border-border/30 text-foreground hover:border-cyan-400/30"
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        {setting.key === "dataRetention" &&
                          [30, 60, 90, 180].map((opt) => (
                            <button
                              key={opt}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleValueSelect(setting.id, opt)
                              }}
                              className={`px-3 py-2 rounded-lg text-xs font-medium transition-subtle border ${
                                currentValue === opt
                                  ? "bg-cyan-400/30 border-cyan-400/50 text-cyan-300"
                                  : "bg-border/20 border-border/30 text-foreground hover:border-cyan-400/30"
                              }`}
                            >
                              {opt}d
                            </button>
                          ))}
                        {/* Additional settings can be added here */}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
