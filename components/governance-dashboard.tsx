"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertCircleIcon,
  CheckCircleIcon,
  ShieldIcon,
  ScaleIcon,
  HeartIcon,
  RefreshCwIcon,
  EyeIcon,
  FileTextIcon,
  TrendingUpIcon,
} from "@/components/icons"
import { FiveLawsModal } from "./five-laws-modal"
import { PolicyCrudModal } from "./policy-crud-modal"
import { EthicsCrudModal } from "./ethics-crud-modal"

interface PolicyRule {
  id: string
  name: string
  version: string
  scope: string[]
  status: "active" | "pending" | "deprecated"
  enforcedAt: string
  violations: number
}

interface EthicsMetric {
  id: string
  key: string
  name: string
  score: number
  threshold: number
  weight: number
  icon: string
  color: string
  trend: "up" | "down" | "stable"
  violations: number
  lastChecked: string
  description: string
}

interface AuditLog {
  id: string
  timestamp: string
  actor: string
  action: string
  severity: "info" | "warning" | "critical"
  details: string
}

export function GovernanceDashboard() {
  const [policies, setPolicies] = useState<PolicyRule[]>([])
  const [ethics, setEthics] = useState<EthicsMetric[]>([])
  const [audits, setAudits] = useState<AuditLog[]>([])
  const [fiveLawsOpen, setFiveLawsOpen] = useState(false)
  const [policyModalOpen, setPolicyModalOpen] = useState(false)
  const [ethicsModalOpen, setEthicsModalOpen] = useState(false)
  const [selectedLaw, setSelectedLaw] = useState<number>(0)
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null)
  const [selectedMetric, setSelectedMetric] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [setupRequired, setSetupRequired] = useState(false)
  const [setupLoading, setSetupLoading] = useState(false)

  useEffect(() => {
    const fetchGovernanceData = async () => {
      setLoading(true)

      try {
        const [policiesRes, ethicsRes, auditsRes] = await Promise.allSettled([
          fetch("/api/governance/policies"),
          fetch("/api/governance/ethics"),
          fetch("/api/orchestration/audit"),
        ])

        if (policiesRes.status === "fulfilled" && policiesRes.value.ok) {
          const data = await policiesRes.value.json()

          if (data.setup_required) {
            setPolicies([])
            setSetupRequired(true)
          } else if (data.policies) {
            setPolicies(
              data.policies.map((p: any) => ({
                id: p.id,
                name: p.name,
                version: p.version,
                scope: p.rules?.scope || [],
                status: "active",
                enforcedAt: new Date(p.effective_from).toLocaleDateString(),
                violations: 0,
              })),
            )
          }
        }

        if (ethicsRes.status === "fulfilled" && ethicsRes.value.ok) {
          const data = await ethicsRes.value.json()
          console.log("[v0] Loaded ethics metrics:", data)
          setEthics(
            data.map((m: any) => ({
              id: m.id,
              key: m.key,
              name: m.key
                .replace(/^ethics_/, "")
                .replace(/_/g, " ")
                .replace(/\b\w/g, (l: string) => l.toUpperCase()),
              score: m.value?.score || 0,
              threshold: m.value?.threshold || 70,
              weight: m.value?.weight || 1.0,
              icon: m.value?.icon || "📊",
              color: m.value?.color || "from-gray-500 to-gray-600",
              trend: "stable",
              violations: 0,
              lastChecked: "Just now",
              description: m.description || "",
            })),
          )
        } else {
          console.log("[v0] No ethics metrics loaded, using empty array")
          setEthics([])
        }

        if (auditsRes.status === "fulfilled" && auditsRes.value.ok) {
          const data = await auditsRes.value.json()
          setAudits(data.slice(0, 10))
        }
      } catch (error) {
        console.error("Error fetching governance data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchGovernanceData()
  }, [])

  const laws = [
    {
      id: 1,
      title: "Human Primacy",
      icon: "👤",
      color: "from-blue-500 to-cyan-500",
      description: "Humans remain the ultimate source of value and judgment",
      compliance: 100,
    },
    {
      id: 2,
      title: "Reproducibility",
      icon: "🔄",
      color: "from-green-500 to-emerald-500",
      description: "All agent actions and decisions must be reproducible",
      compliance: 98,
    },
    {
      id: 3,
      title: "Verifiability",
      icon: "✓",
      color: "from-purple-500 to-pink-500",
      description: "Claims and outputs must be verifiable with citations",
      compliance: 95,
    },
    {
      id: 4,
      title: "Harmony",
      icon: "🎵",
      color: "from-orange-500 to-red-500",
      description: "Agents collaborate toward aligned goals",
      compliance: 92,
    },
    {
      id: 5,
      title: "Equilibrium",
      icon: "⚖️",
      color: "from-indigo-500 to-violet-500",
      description: "Balanced ethical decision-making across domains",
      compliance: 90,
    },
  ]

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUpIcon className="w-4 h-4 text-success" />
    if (trend === "down") return <TrendingUpIcon className="w-4 h-4 text-error rotate-180" />
    return <div className="w-4 h-4 text-text-muted">—</div>
  }

  const getSeverityColor = (severity: string) => {
    if (severity === "critical") return "bg-error/20 text-error border-error/30"
    if (severity === "warning") return "bg-warning/20 text-warning border-warning/30"
    return "bg-primary/20 text-primary border-primary/30"
  }

  const handleDeletePolicy = async (id: string) => {
    if (!confirm("Are you sure you want to delete this policy?")) return

    try {
      const res = await fetch(`/api/governance/policies/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete")

      setPolicies(policies.filter((p) => p.id !== id))
    } catch (error) {
      console.error("Error deleting policy:", error)
      alert("Failed to delete policy")
    }
  }

  const handlePolicySaved = async () => {
    const res = await fetch("/api/governance/policies")
    const data = await res.json()
    setPolicies(
      data.map((p: any) => ({
        id: p.id,
        name: p.name,
        version: p.version,
        scope: p.rules?.scope || [],
        status: "active",
        enforcedAt: new Date(p.effective_from).toLocaleDateString(),
        violations: 0,
      })),
    )
    setSelectedPolicy(null)
  }

  const handleEthicsSaved = async () => {
    const res = await fetch("/api/governance/ethics")
    const data = await res.json()
    setEthics(
      data.map((m: any) => ({
        id: m.id,
        key: m.key,
        name: m.key
          .replace(/^ethics_/, "")
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l: string) => l.toUpperCase()),
        score: m.value?.score || 0,
        threshold: m.value?.threshold || 70,
        weight: m.value?.weight || 1.0,
        icon: m.value?.icon || "📊",
        color: m.value?.color || "from-gray-500 to-gray-600",
        trend: "stable",
        violations: 0,
        lastChecked: "Just now",
        description: m.description || "",
      })),
    )
    setSelectedMetric(null)
  }

  const handleAutoSetup = async () => {
    setSetupLoading(true)

    try {
      const res = await fetch("/api/governance/setup", { method: "POST" })
      const data = await res.json()

      if (res.ok) {
        alert("Governance tables created successfully! Refreshing data...")
        window.location.reload()
      } else {
        alert(
          `Setup failed: ${data.details}\n\n${data.instructions}\n\nPlease run the SQL scripts manually in your Supabase dashboard.`,
        )
      }
    } catch (error) {
      console.error("Setup error:", error)
      alert("Failed to run automatic setup. Please run the SQL scripts manually in your Supabase dashboard.")
    } finally {
      setSetupLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-4">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-text-secondary">Loading governance data...</p>
        </div>
      </div>
    )
  }

  if (setupRequired) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-6 max-w-2xl">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-500/30 flex items-center justify-center mx-auto">
            <AlertCircleIcon className="w-8 h-8 text-amber-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-foreground">Governance Setup Required</h3>
            <p className="text-text-secondary">
              The governance framework needs to be initialized before you can manage policies and ethics metrics.
            </p>
          </div>

          <div className="glass-sm border border-border/30 rounded-xl p-6 text-left space-y-4">
            <h4 className="font-bold text-foreground">What will be created:</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <CheckCircleIcon className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                <span>Tasks table for orchestrated agent workflows</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircleIcon className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                <span>Plans table for execution strategies</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircleIcon className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                <span>Policies table for governance rules</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircleIcon className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                <span>Audit events table for immutable logging</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircleIcon className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                <span>Approvals table for human-in-the-loop workflows</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircleIcon className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                <span>Row-level security policies for data protection</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={handleAutoSetup} disabled={setupLoading} className="gap-2">
              {setupLoading ? (
                <>
                  <RefreshCwIcon className="w-4 h-4 animate-spin" />
                  Setting up...
                </>
              ) : (
                <>
                  <ShieldIcon className="w-4 h-4" />
                  Run Automatic Setup
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => setSetupRequired(false)} disabled={setupLoading}>
              I'll Set Up Manually
            </Button>
          </div>

          <div className="text-xs text-text-muted space-y-1">
            <p>
              <strong>Manual setup:</strong> Run the SQL scripts in your Supabase dashboard
            </p>
            <p className="font-mono bg-muted/30 px-2 py-1 rounded inline-block">scripts/004-governance-tables.sql</p>
            <p className="font-mono bg-muted/30 px-2 py-1 rounded inline-block">scripts/005-add-policies-table.sql</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <FiveLawsModal open={fiveLawsOpen} onOpenChange={setFiveLawsOpen} selectedLaw={selectedLaw} />
      <PolicyCrudModal
        open={policyModalOpen}
        onOpenChange={setPolicyModalOpen}
        policy={selectedPolicy}
        onSave={handlePolicySaved}
      />
      <EthicsCrudModal
        open={ethicsModalOpen}
        onOpenChange={setEthicsModalOpen}
        metric={selectedMetric}
        onSave={handleEthicsSaved}
      />

      {/* Five Laws Overview */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-foreground">The Five Laws</h3>
            <p className="text-text-secondary">Foundational principles governing all agent behavior</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedLaw(0)
              setFiveLawsOpen(true)
            }}
            className="gap-2"
          >
            <EyeIcon className="w-4 h-4" />
            View Details
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {laws.map((law, idx) => (
            <button
              key={law.id}
              onClick={() => {
                setSelectedLaw(idx)
                setFiveLawsOpen(true)
              }}
              className="group glass-sm border border-border/30 rounded-xl p-5 hover:border-primary/50 transition-subtle cursor-pointer text-left"
            >
              <div className="space-y-3">
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-r ${law.color} flex items-center justify-center text-2xl mb-2`}
                >
                  {law.icon}
                </div>
                <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">{law.title}</h4>
                <p className="text-xs text-text-secondary line-clamp-2">{law.description}</p>
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-text-muted">Compliance</span>
                    <span className="text-xs font-bold text-success">{law.compliance}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-success transition-all duration-500"
                      style={{ width: `${law.compliance}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Governance Tabs */}
      <Tabs defaultValue="policies" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-card/50 border border-border/30">
          <TabsTrigger value="policies" className="gap-2">
            <ShieldIcon className="w-4 h-4" />
            Policies
          </TabsTrigger>
          <TabsTrigger value="ethics" className="gap-2">
            <HeartIcon className="w-4 h-4" />
            Ethics Metrics
          </TabsTrigger>
          <TabsTrigger value="audit" className="gap-2">
            <FileTextIcon className="w-4 h-4" />
            Audit Trail
          </TabsTrigger>
        </TabsList>

        <TabsContent value="policies" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-text-secondary">Active policy rules governing agent behavior</p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-transparent"
                onClick={() => {
                  setSelectedPolicy(null)
                  setPolicyModalOpen(true)
                }}
              >
                + Create Policy
              </Button>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <RefreshCwIcon className="w-4 h-4" />
                Sync Policies
              </Button>
            </div>
          </div>

          {policies.map((policy) => (
            <div
              key={policy.id}
              className="glass-sm border border-border/30 rounded-xl p-6 hover:border-primary/30 transition-subtle"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h4 className="text-lg font-bold text-foreground">{policy.name}</h4>
                    <Badge variant="outline" className="bg-success/20 text-success border-success/30 text-xs">
                      v{policy.version}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        policy.status === "active"
                          ? "bg-success/20 text-success border-success/30"
                          : "bg-text-muted/20 text-text-muted border-text-muted/30"
                      }`}
                    >
                      {policy.status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {policy.scope.map((scope) => (
                      <span
                        key={scope}
                        className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
                      >
                        {scope}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-xs text-text-muted">Enforced since</p>
                  <p className="text-sm font-medium text-foreground">{policy.enforcedAt}</p>
                  {policy.violations > 0 ? (
                    <div className="flex items-center gap-1 text-error">
                      <AlertCircleIcon className="w-4 h-4" />
                      <span className="text-xs font-bold">{policy.violations} violations</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-success">
                      <CheckCircleIcon className="w-4 h-4" />
                      <span className="text-xs">No violations</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedPolicy(policy)
                      setPolicyModalOpen(true)
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeletePolicy(policy.id)}
                    className="text-error hover:text-error"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="ethics" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-text-secondary">The Five Laws and custom ethics metrics tracking agent compliance</p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-transparent"
                onClick={() => {
                  setSelectedMetric(null)
                  setEthicsModalOpen(true)
                }}
              >
                + Add Custom Metric
              </Button>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <RefreshCwIcon className="w-4 h-4" />
                Refresh Metrics
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ethics.map((metric) => (
              <div
                key={metric.id}
                className="glass-sm border border-border/30 rounded-xl p-6 hover:border-primary/30 transition-subtle"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full bg-gradient-to-r ${metric.color} flex items-center justify-center text-xl`}
                      >
                        {metric.icon}
                      </div>
                      <h4 className="text-lg font-bold text-foreground">{metric.name}</h4>
                    </div>
                    <div className="flex items-center gap-3">
                      {getTrendIcon(metric.trend)}
                      <span className="text-2xl font-bold text-foreground">{metric.score}%</span>
                    </div>
                  </div>

                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        metric.score >= metric.threshold
                          ? "bg-success"
                          : metric.score >= metric.threshold - 20
                            ? "bg-warning"
                            : "bg-error"
                      }`}
                      style={{ width: `${metric.score}%` }}
                    ></div>
                  </div>

                  <div className="text-xs text-text-muted space-y-1">
                    <div className="flex justify-between">
                      <span>Threshold: {metric.threshold}%</span>
                      <span>Weight: {metric.weight}x</span>
                    </div>
                    <p className="line-clamp-2">{metric.description}</p>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-text-muted">Last checked: {metric.lastChecked}</span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedMetric(metric)
                          setEthicsModalOpen(true)
                        }}
                      >
                        Edit
                      </Button>
                      {!["Human Primacy", "Reproducibility", "Verifiability", "Harmony", "Equilibrium"].includes(
                        metric.name,
                      ) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            if (!confirm("Delete this custom metric?")) return
                            try {
                              const res = await fetch(`/api/governance/ethics?id=${metric.id}`, { method: "DELETE" })
                              if (res.ok) handleEthicsSaved()
                            } catch (error) {
                              console.error("Error deleting metric:", error)
                            }
                          }}
                          className="text-error hover:text-error"
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-text-secondary">Immutable log of all governance-related actions</p>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <FileTextIcon className="w-4 h-4" />
              Export Logs
            </Button>
          </div>

          <div className="space-y-3">
            {audits.map((log, idx) => (
              <div
                key={log.id}
                className="glass-sm border border-border/30 rounded-xl p-5 hover:border-primary/30 transition-subtle"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <ScaleIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-foreground">{log.action}</h4>
                        <p className="text-sm text-text-secondary mt-1">{log.details}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`${getSeverityColor(log.severity)} text-xs whitespace-nowrap`}
                      >
                        {log.severity}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-text-muted">
                      <span>Actor: {log.actor}</span>
                      <span>•</span>
                      <span>{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
