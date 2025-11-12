"use client"

import { useState, useEffect } from "react"
import { AppHeader } from "@/components/app-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  BrainIcon as Brain,
  ScaleIcon as Scale,
  ShieldIcon as Shield,
  UsersIcon as Users,
  CheckCircle2Icon as CheckCircle2,
  AlertTriangleIcon as AlertTriangle,
  Play,
  EyeIcon as Eye,
  GitBranch,
  NetworkIcon as Network,
  FileTextIcon as FileText,
  Database,
  Copy,
  CheckCircleIcon as Check,
  AlertCircleIcon as AlertCircle,
} from "@/components/icons"
import { TaskCreationModal } from "@/components/task-creation-modal"
import { TaskDetailModal } from "@/components/task-detail-modal"
import { ApprovalQueue } from "@/components/approval-queue"
import { AuditTrail } from "@/components/audit-trail"

export default function OrchestrationPage() {
  const [setupStatus, setSetupStatus] = useState<"checking" | "missing" | "ready">("checking")
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("tasks")
  const [tasks, setTasks] = useState([])
  const [approvals, setApprovals] = useState([])
  const [auditEvents, setAuditEvents] = useState([])
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)

  useEffect(() => {
    fetchOrchestrationData()
  }, [])

  const fetchOrchestrationData = async () => {
    try {
      const results = await Promise.allSettled([
        fetch("/api/orchestration/tasks"),
        fetch("/api/orchestration/approvals"),
        fetch("/api/orchestration/audit"),
        fetch("/api/agents"),
      ])

      const anyMissingTables = results.some((result) => result.status === "fulfilled" && result.value.status === 404)

      if (anyMissingTables) {
        setSetupStatus("missing")
        setLoading(false)
        return
      }

      const [tasksRes, approvalsRes, auditRes, agentsRes] = results.map((r) =>
        r.status === "fulfilled" ? r.value : null,
      )

      if (tasksRes?.ok) {
        const data = await tasksRes.json()
        setTasks(data)
      }
      if (approvalsRes?.ok) {
        const data = await approvalsRes.json()
        setApprovals(data)
      }
      if (auditRes?.ok) {
        const data = await auditRes.json()
        setAuditEvents(data)
      }
      if (agentsRes?.ok) {
        const data = await agentsRes.json()
        console.log("[v0] Loaded agents:", data.length)
        setAgents(data || [])
      }

      setSetupStatus("ready")
    } catch (error) {
      console.error("[v0] Error fetching orchestration data:", error)
      setSetupStatus("missing")
    } finally {
      setLoading(false)
    }
  }

  const sqlScript = `-- Run this in your Supabase SQL Editor to enable orchestration

-- Create update trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  intent TEXT NOT NULL,
  purpose JSONB NOT NULL DEFAULT '{}',
  status TEXT CHECK (status IN ('pending', 'planning', 'executing', 'reviewing', 'approved', 'rejected', 'completed')) DEFAULT 'pending',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  requires_pre_approval BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit events table
CREATE TABLE IF NOT EXISTS public.audit_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  before JSONB,
  after JSONB,
  signature TEXT,
  metadata JSONB
);

-- Approvals table
CREATE TABLE IF NOT EXISTS public.approvals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  step_id TEXT,
  reviewer_id UUID,
  decision TEXT CHECK (decision IN ('approved', 'rejected', 'modified')) NOT NULL,
  justification TEXT,
  modifications JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;

-- RLS policies for anonymous demo access
CREATE POLICY "Allow anonymous task access" ON public.tasks FOR SELECT USING (user_id IS NULL OR auth.uid() = user_id);
CREATE POLICY "Allow anonymous task creation" ON public.tasks FOR INSERT WITH CHECK (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Allow anonymous audit access" ON public.audit_events FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = audit_events.task_id AND (tasks.user_id IS NULL OR tasks.user_id = auth.uid()))
);

CREATE POLICY "Allow anonymous approval access" ON public.approvals FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = approvals.task_id AND (tasks.user_id IS NULL OR tasks.user_id = auth.uid()))
);

-- Create indexes
CREATE INDEX IF NOT EXISTS tasks_user_id_idx ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS audit_events_task_id_idx ON public.audit_events(task_id);
CREATE INDEX IF NOT EXISTS approvals_task_id_idx ON public.approvals(task_id);

-- Add trigger
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();`

  function copyScript() {
    navigator.clipboard.writeText(sqlScript)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (setupStatus === "checking") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0118] via-[#1a0b2e] to-[#0a0118]">
        <AppHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Checking orchestration setup...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (setupStatus === "missing") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0118] via-[#1a0b2e] to-[#0a0118]">
        <AppHeader />
        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-4xl mx-auto p-8 bg-card/40 backdrop-blur-sm border-primary/20">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 rounded-full bg-yellow-500/10">
                <AlertCircle className="w-6 h-6 text-yellow-500" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">Orchestration Setup Required</h2>
                <p className="text-muted-foreground mb-6">
                  The governance orchestration system requires additional database tables. Run the SQL script below to
                  enable the Five Laws orchestration framework.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Database className="w-5 h-5 text-primary" />
                  Setup Instructions
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-2">
                  <li>Open your Supabase project dashboard</li>
                  <li>Navigate to the SQL Editor</li>
                  <li>Copy and paste the SQL script below</li>
                  <li>Click "Run" to execute the script</li>
                  <li>Refresh this page once complete</li>
                </ol>
              </div>

              <div className="relative">
                <pre className="bg-muted/50 p-4 rounded-lg overflow-x-auto text-sm border border-primary/20 max-h-[400px] overflow-y-auto">
                  <code>{sqlScript}</code>
                </pre>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2 bg-transparent"
                  onClick={copyScript}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setSetupStatus("checking")
                    setLoading(true)
                    fetchOrchestrationData()
                  }}
                  className="gap-2"
                >
                  <Play className="w-4 h-4" />
                  Check Setup Status
                </Button>
                <Button variant="outline" asChild>
                  <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">
                    Open Supabase Dashboard
                  </a>
                </Button>
              </div>
            </div>
          </Card>
        </main>
      </div>
    )
  }

  const stats = {
    totalTasks: tasks.length,
    activeTasks: tasks.filter((t) => t.status === "in_progress" || t.status === "executing").length,
    pendingApprovals: approvals.filter((a) => !a.decision).length,
    completedTasks: tasks.filter((t) => t.status === "completed").length,
    totalAgents: agents.length,
    activeAgents: agents.filter((a) => a.status === "active").length,
  }

  return (
    <div className="min-h-screen bg-background cosmic-gradient">
      <AppHeader />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-balance">Orchestration Control</h1>
              <p className="text-lg text-text-secondary mt-2">
                Multi-agent task orchestration with Five Laws governance
              </p>
            </div>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gradient-to-r from-primary to-accent text-white"
            >
              <Play className="w-4 h-4 mr-2" />
              New Task
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card className="glass-sm border border-border/30 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <GitBranch className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">{stats.totalTasks}</p>
                <p className="text-sm text-text-secondary">Total Tasks</p>
              </div>
            </div>
          </Card>

          <Card className="glass-sm border border-border/30 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
                <Play className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-3xl font-bold text-success">{stats.activeTasks}</p>
                <p className="text-sm text-text-secondary">Active Tasks</p>
              </div>
            </div>
          </Card>

          <Card className="glass-sm border border-border/30 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-3xl font-bold text-warning">{stats.pendingApprovals}</p>
                <p className="text-sm text-text-secondary">Pending Approvals</p>
              </div>
            </div>
          </Card>

          <Card className="glass-sm border border-border/30 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-3xl font-bold text-accent">{stats.completedTasks}</p>
                <p className="text-sm text-text-secondary">Completed</p>
              </div>
            </div>
          </Card>

          <Card className="glass-sm border border-border/30 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">{stats.totalAgents}</p>
                <p className="text-sm text-text-secondary">Agents ({stats.activeAgents} active)</p>
              </div>
            </div>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="glass px-1 py-1 rounded-xl border border-border/20 w-fit">
            <TabsList className="grid grid-cols-4 bg-transparent gap-1">
              <TabsTrigger value="tasks" className="gap-2">
                <GitBranch className="w-4 h-4" />
                Tasks
              </TabsTrigger>
              <TabsTrigger value="approvals" className="gap-2">
                <Eye className="w-4 h-4" />
                Approvals
              </TabsTrigger>
              <TabsTrigger value="agents" className="gap-2">
                <Network className="w-4 h-4" />
                Agent Network
              </TabsTrigger>
              <TabsTrigger value="audit" className="gap-2">
                <FileText className="w-4 h-4" />
                Audit Trail
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="tasks" className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-text-secondary">Loading tasks...</p>
              </div>
            ) : tasks.length > 0 ? (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <Card
                    key={task.id}
                    className="glass-sm border border-border/30 p-6 hover:border-primary/50 transition-all cursor-pointer"
                    onClick={() => setSelectedTask(task)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-bold text-foreground">{task.description}</h3>
                          <Badge
                            className={`
                            ${task.status === "completed" ? "bg-success/20 text-success border-success/30" : ""}
                            ${task.status === "in_progress" ? "bg-primary/20 text-primary border-primary/30" : ""}
                            ${task.status === "pending" ? "bg-warning/20 text-warning border-warning/30" : ""}
                            ${task.status === "failed" ? "bg-error/20 text-error border-error/30" : ""}
                          `}
                          >
                            {task.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-text-secondary">
                          <span>Priority: {task.priority}</span>
                          <span>Risk: {task.riskLevel}</span>
                          {task.assignedAgent && <span>Agent: {task.assignedAgent}</span>}
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="glass-sm border border-border/30 p-12 text-center">
                <Brain className="w-16 h-16 mx-auto mb-4 text-primary/50" />
                <h3 className="text-xl font-bold text-foreground mb-2">No Tasks Yet</h3>
                <p className="text-text-secondary mb-4">
                  Create your first orchestrated task to see the Five Laws in action
                </p>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Play className="w-4 h-4 mr-2" />
                  Create Task
                </Button>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="approvals">
            <ApprovalQueue approvals={approvals} onRefresh={fetchOrchestrationData} />
          </TabsContent>

          <TabsContent value="agents">
            <div className="glass-sm border border-border/30 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold">Agent Network</h3>
                  <p className="text-text-secondary mt-1">Your sages available for task orchestration</p>
                </div>
                <Badge variant="outline" className="text-lg px-4 py-2">
                  {agents.length} Agents
                </Badge>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <p className="text-text-secondary">Loading agents...</p>
                </div>
              ) : agents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {agents.map((agent) => (
                    <Card
                      key={agent.id}
                      className="glass-sm border border-border/30 p-6 hover:border-primary/50 transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                          <Users className="w-6 h-6 text-primary" />
                        </div>
                        <Badge
                          className={`
                            ${agent.status === "active" ? "bg-success/20 text-success border-success/30" : ""}
                            ${agent.status === "idle" ? "bg-muted/20 text-muted-foreground border-muted/30" : ""}
                            ${agent.status === "thinking" ? "bg-primary/20 text-primary border-primary/30" : ""}
                          `}
                        >
                          {agent.status}
                        </Badge>
                      </div>
                      <h4 className="text-lg font-bold text-foreground mb-1">{agent.name}</h4>
                      <p className="text-sm text-primary mb-2">{agent.role}</p>
                      <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                        {agent.description || agent.purpose}
                      </p>
                      <div className="flex items-center justify-between text-xs text-text-secondary">
                        <span>Harmony: {agent.harmonyScore || agent.harmony_score}%</span>
                        <span>Ethics: {agent.ethicsAlignment || agent.ethics_alignment}%</span>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="glass-sm border border-border/30 p-12 text-center">
                  <Users className="w-16 h-16 mx-auto mb-4 text-primary/50" />
                  <h3 className="text-xl font-bold text-foreground mb-2">No Agents Yet</h3>
                  <p className="text-text-secondary mb-4">
                    Create sages in the demo to use them for task orchestration
                  </p>
                  <Button asChild variant="outline">
                    <a href="/demo">Go to Demo</a>
                  </Button>
                </Card>
              )}

              {agents.length > 0 && (
                <div className="mt-8 pt-8 border-t border-border/30">
                  <h4 className="text-lg font-bold mb-4">Orchestration Roles</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { name: "Planner", icon: Brain, role: "Task Decomposition", color: "primary" },
                      { name: "Orchestrator", icon: Network, role: "Execution Flow", color: "accent" },
                      { name: "Critic", icon: Scale, role: "Quality Review", color: "warning" },
                      { name: "Judge", icon: Scale, role: "Ethics Compliance", color: "success" },
                      { name: "Safety", icon: Shield, role: "Risk Assessment", color: "error" },
                    ].map((role) => (
                      <div key={role.name} className="flex items-center gap-3 p-3 rounded-lg bg-card/20">
                        <div className={`w-10 h-10 rounded-lg bg-${role.color}/20 flex items-center justify-center`}>
                          <role.icon className={`w-5 h-5 text-${role.color}`} />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{role.name}</p>
                          <p className="text-xs text-text-secondary">{role.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="audit">
            <AuditTrail events={auditEvents} />
          </TabsContent>
        </Tabs>
      </div>

      <TaskCreationModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={fetchOrchestrationData}
      />

      {selectedTask && <TaskDetailModal task={selectedTask} onClose={() => setSelectedTask(null)} />}
    </div>
  )
}
