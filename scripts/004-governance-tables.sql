-- Add governance orchestration tables

-- Tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  intent TEXT NOT NULL,
  purpose JSONB NOT NULL,
  status TEXT CHECK (status IN ('pending', 'planning', 'executing', 'reviewing', 'approved', 'rejected', 'completed')) DEFAULT 'pending',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  requires_pre_approval BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Plans table
CREATE TABLE IF NOT EXISTS public.plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  steps JSONB NOT NULL,
  risk_score FLOAT CHECK (risk_score >= 0 AND risk_score <= 1),
  rationale TEXT,
  signature TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
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
  reviewer_id UUID REFERENCES public.profiles(id),
  decision TEXT CHECK (decision IN ('approved', 'rejected', 'modified')) NOT NULL,
  justification TEXT,
  modifications JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Message envelopes table (for inter-agent communication)
CREATE TABLE IF NOT EXISTS public.message_envelopes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  actor TEXT NOT NULL,
  intent TEXT NOT NULL,
  inputs JSONB,
  outputs JSONB,
  risk JSONB,
  policy JSONB,
  provenance JSONB,
  confidence FLOAT CHECK (confidence >= 0 AND confidence <= 1),
  signature TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Policies table
CREATE TABLE IF NOT EXISTS public.policies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  version TEXT NOT NULL,
  rules JSONB NOT NULL,
  effective_from TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(name, version)
);

-- Enable RLS
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_envelopes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policies ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view own tasks" ON public.tasks FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can create own tasks" ON public.tasks FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can update own tasks" ON public.tasks FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can view plans for own tasks" ON public.plans FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = plans.task_id AND (tasks.user_id = auth.uid() OR tasks.user_id IS NULL))
);

CREATE POLICY "Users can view audit events for own tasks" ON public.audit_events FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = audit_events.task_id AND (tasks.user_id = auth.uid() OR tasks.user_id IS NULL))
);

CREATE POLICY "Users can view approvals for own tasks" ON public.approvals FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = approvals.task_id AND (tasks.user_id = auth.uid() OR tasks.user_id IS NULL))
);

CREATE POLICY "Anyone can view policies" ON public.policies FOR SELECT USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS tasks_user_id_idx ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS plans_task_id_idx ON public.plans(task_id);
CREATE INDEX IF NOT EXISTS audit_events_task_id_idx ON public.audit_events(task_id);
CREATE INDEX IF NOT EXISTS approvals_task_id_idx ON public.approvals(task_id);
CREATE INDEX IF NOT EXISTS message_envelopes_task_id_idx ON public.message_envelopes(task_id);

-- Add updated_at trigger for tasks
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
