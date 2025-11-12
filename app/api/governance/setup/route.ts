import { createServiceRoleClient } from "@/lib/supabase/service-role"
import { NextResponse } from "next/server"

const governanceTables = `
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
ALTER TABLE public.policies ENABLE ROW LEVEL SECURITY;

-- RLS policies for tasks
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'tasks' AND policyname = 'Users can view own tasks') THEN
    CREATE POLICY "Users can view own tasks" ON public.tasks FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'tasks' AND policyname = 'Users can create own tasks') THEN
    CREATE POLICY "Users can create own tasks" ON public.tasks FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'tasks' AND policyname = 'Users can update own tasks') THEN
    CREATE POLICY "Users can update own tasks" ON public.tasks FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);
  END IF;
END $$;

-- RLS policies for plans
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'plans' AND policyname = 'Users can view plans for own tasks') THEN
    CREATE POLICY "Users can view plans for own tasks" ON public.plans FOR SELECT USING (
      EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = plans.task_id AND (tasks.user_id = auth.uid() OR tasks.user_id IS NULL))
    );
  END IF;
END $$;

-- RLS policies for audit_events  
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'audit_events' AND policyname = 'Users can view audit events for own tasks') THEN
    CREATE POLICY "Users can view audit events for own tasks" ON public.audit_events FOR SELECT USING (
      EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = audit_events.task_id AND (tasks.user_id = auth.uid() OR tasks.user_id IS NULL))
    );
  END IF;
END $$;

-- RLS policies for approvals
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'approvals' AND policyname = 'Users can view approvals for own tasks') THEN
    CREATE POLICY "Users can view approvals for own tasks" ON public.approvals FOR SELECT USING (
      EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = approvals.task_id AND (tasks.user_id = auth.uid() OR tasks.user_id IS NULL))
    );
  END IF;
END $$;

-- RLS policies for policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'policies' AND policyname = 'Anyone can view policies') THEN
    CREATE POLICY "Anyone can view policies" ON public.policies FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'policies' AND policyname = 'Allow anonymous policy creation') THEN
    CREATE POLICY "Allow anonymous policy creation" ON public.policies FOR INSERT WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'policies' AND policyname = 'Allow anonymous policy updates') THEN
    CREATE POLICY "Allow anonymous policy updates" ON public.policies FOR UPDATE USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'policies' AND policyname = 'Allow anonymous policy deletion') THEN
    CREATE POLICY "Allow anonymous policy deletion" ON public.policies FOR DELETE USING (true);
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS tasks_user_id_idx ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS plans_task_id_idx ON public.plans(task_id);
CREATE INDEX IF NOT EXISTS audit_events_task_id_idx ON public.audit_events(task_id);
CREATE INDEX IF NOT EXISTS approvals_task_id_idx ON public.approvals(task_id);
CREATE INDEX IF NOT EXISTS policies_name_idx ON public.policies(name);
`

export async function POST() {
  try {
    const supabase = createServiceRoleClient()

    // Execute the SQL script
    const { error } = await supabase.rpc("exec_sql", { sql: governanceTables })

    if (error) {
      // If rpc doesn't exist, try direct query
      const { error: queryError } = await supabase.from("_sql").insert({ query: governanceTables })

      if (queryError) {
        throw queryError
      }
    }

    return NextResponse.json({
      success: true,
      message: "Governance tables created successfully",
    })
  } catch (error: any) {
    console.error("[v0] Setup error:", error)

    return NextResponse.json(
      {
        error: "Failed to setup governance tables",
        details: error.message,
        instructions:
          "Please run the SQL scripts manually in your Supabase dashboard: scripts/004-governance-tables.sql and scripts/005-add-policies-table.sql",
      },
      { status: 500 },
    )
  }
}
