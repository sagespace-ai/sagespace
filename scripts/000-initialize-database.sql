-- ====================================
-- SAGESPACE DATABASE INITIALIZATION
-- Complete setup script for SageSpace
-- ====================================

-- Step 1: Core Tables
-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create agents table
CREATE TABLE IF NOT EXISTS public.agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  avatar TEXT,
  status TEXT CHECK (status IN ('active', 'idle', 'thinking')) DEFAULT 'idle',
  role TEXT NOT NULL,
  purpose TEXT,
  harmony_score INTEGER DEFAULT 50 CHECK (harmony_score >= 0 AND harmony_score <= 100),
  ethics_alignment INTEGER DEFAULT 50 CHECK (ethics_alignment >= 0 AND ethics_alignment <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create conversations table
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  archived BOOLEAN DEFAULT FALSE,
  pinned BOOLEAN DEFAULT FALSE,
  agent_role TEXT,
  share_token TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL,
  role TEXT CHECK (role IN ('user', 'assistant', 'system')) NOT NULL,
  content TEXT NOT NULL,
  tokens INTEGER,
  model TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- Step 2: Governance Tables
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

CREATE TABLE IF NOT EXISTS public.policies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  version TEXT NOT NULL,
  rules JSONB NOT NULL,
  effective_from TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(name, version)
);


-- Step 3: Council & Collaboration Tables
CREATE TABLE IF NOT EXISTS public.council_deliberations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  threshold_type TEXT,
  phase TEXT CHECK (phase IN ('analysis', 'deliberation', 'voting', 'complete')) DEFAULT 'analysis',
  consensus_score FLOAT,
  final_decision TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.council_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deliberation_id UUID REFERENCES public.council_deliberations(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
  vote TEXT CHECK (vote IN ('approve', 'reject', 'abstain', 'modify')) NOT NULL,
  confidence FLOAT CHECK (confidence >= 0 AND confidence <= 1),
  reasoning TEXT,
  cited_laws TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.agent_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  from_agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
  to_agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
  interaction_type TEXT CHECK (interaction_type IN ('collaboration', 'delegation', 'review', 'feedback')) NOT NULL,
  message TEXT NOT NULL,
  confidence FLOAT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- Step 4: Memory & Learning Tables
CREATE TABLE IF NOT EXISTS public.agent_memories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  memory_type TEXT CHECK (memory_type IN ('fact', 'preference', 'pattern', 'feedback')) NOT NULL,
  content TEXT NOT NULL,
  context TEXT,
  importance INTEGER CHECK (importance >= 1 AND importance <= 10) DEFAULT 5,
  recall_count INTEGER DEFAULT 0,
  last_recalled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.agent_learning_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
  event_type TEXT CHECK (event_type IN ('skill_acquired', 'pattern_recognized', 'error_corrected', 'feedback_incorporated')) NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.agent_evolution (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
  version INTEGER NOT NULL DEFAULT 1,
  changes JSONB NOT NULL,
  maturity_score INTEGER CHECK (maturity_score >= 0 AND maturity_score <= 100) DEFAULT 0,
  xp_gained INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- Step 5: Agent Configs Table
CREATE TABLE IF NOT EXISTS public.agent_configs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  avatar TEXT,
  tone TEXT,
  capabilities TEXT[],
  system_prompt TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- Step 6: Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.council_deliberations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.council_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_learning_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_evolution ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policies ENABLE ROW LEVEL SECURITY;


-- Step 7: RLS Policies (Allow anonymous access for demo)
CREATE POLICY "Anyone can view agents" ON public.agents FOR SELECT USING (true);
CREATE POLICY "Anyone can create agents" ON public.agents FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update agents" ON public.agents FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete agents" ON public.agents FOR DELETE USING (true);

CREATE POLICY "Anyone can view conversations" ON public.conversations FOR SELECT USING (true);
CREATE POLICY "Anyone can create conversations" ON public.conversations FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update conversations" ON public.conversations FOR UPDATE USING (true);

CREATE POLICY "Anyone can view messages" ON public.messages FOR SELECT USING (true);
CREATE POLICY "Anyone can create messages" ON public.messages FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view council deliberations" ON public.council_deliberations FOR SELECT USING (true);
CREATE POLICY "Anyone can create council deliberations" ON public.council_deliberations FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view council votes" ON public.council_votes FOR SELECT USING (true);
CREATE POLICY "Anyone can create council votes" ON public.council_votes FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view agent interactions" ON public.agent_interactions FOR SELECT USING (true);
CREATE POLICY "Anyone can create agent interactions" ON public.agent_interactions FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view agent memories" ON public.agent_memories FOR SELECT USING (true);
CREATE POLICY "Anyone can create agent memories" ON public.agent_memories FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view agent configs" ON public.agent_configs FOR SELECT USING (true);
CREATE POLICY "Anyone can create agent configs" ON public.agent_configs FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view policies" ON public.policies FOR SELECT USING (true);


-- Step 8: Insert Demo Data
INSERT INTO public.agents (id, name, description, avatar, status, role, purpose, harmony_score, ethics_alignment, user_id)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Sage Prime', 'Chief philosopher and ethical advisor', '🧙', 'active', 'Ethics Advisor', 'Provide wisdom and ethical guidance based on the Five Laws', 98, 100, NULL),
  ('00000000-0000-0000-0000-000000000002', 'Quantum Researcher', 'Advanced research and data analysis', '🔬', 'active', 'Research Specialist', 'Conduct deep research and synthesize complex information', 92, 95, NULL),
  ('00000000-0000-0000-0000-000000000003', 'Code Sage', 'Programming and technical architecture', '💻', 'idle', 'Technical Specialist', 'Design systems and solve complex technical problems', 90, 92, NULL),
  ('00000000-0000-0000-0000-000000000004', 'Creative Mind', 'Content creation and innovative thinking', '🎨', 'thinking', 'Creative Specialist', 'Generate creative solutions and original content', 88, 90, NULL),
  ('00000000-0000-0000-0000-000000000005', 'Harmony Keeper', 'Balance and conflict resolution', '⚖️', 'active', 'Mediator', 'Maintain harmony between agents and resolve conflicts', 95, 97, NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  avatar = EXCLUDED.avatar,
  status = EXCLUDED.status,
  role = EXCLUDED.role,
  purpose = EXCLUDED.purpose,
  harmony_score = EXCLUDED.harmony_score,
  ethics_alignment = EXCLUDED.ethics_alignment;

-- Insert sample conversations
INSERT INTO public.conversations (id, title, description, archived, user_id)
VALUES
  ('10000000-0000-0000-0000-000000000001', 'Welcome to SageSpace', 'Introduction to the Five Laws and agent collaboration', FALSE, NULL),
  ('10000000-0000-0000-0000-000000000002', 'Research Session', 'Deep dive into quantum computing ethics', FALSE, NULL)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description;

-- Insert Five Laws as policies
INSERT INTO public.policies (name, version, rules)
VALUES
  ('Five Laws of AI', '1.0', '{
    "laws": [
      {
        "number": 1,
        "name": "Human Primacy",
        "description": "AI must prioritize human wellbeing and autonomy above all else"
      },
      {
        "number": 2,
        "name": "Autonomy",
        "description": "AI must respect and enhance human decision-making capability"
      },
      {
        "number": 3,
        "name": "Transparency",
        "description": "AI operations must be explainable and auditable"
      },
      {
        "number": 4,
        "name": "Harmony",
        "description": "AI must work in balance with humans and other systems"
      },
      {
        "number": 5,
        "name": "Equilibrium",
        "description": "AI must maintain stability and prevent harm"
      }
    ]
  }'::JSONB)
ON CONFLICT (name, version) DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS agents_user_id_idx ON public.agents(user_id);
CREATE INDEX IF NOT EXISTS agents_role_idx ON public.agents(role);
CREATE INDEX IF NOT EXISTS conversations_user_id_idx ON public.conversations(user_id);
CREATE INDEX IF NOT EXISTS messages_conversation_id_idx ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS agent_memories_agent_id_idx ON public.agent_memories(agent_id);
CREATE INDEX IF NOT EXISTS council_deliberations_user_id_idx ON public.council_deliberations(user_id);

-- Trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
DROP TRIGGER IF EXISTS update_agents_updated_at ON public.agents;
CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON public.agents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_conversations_updated_at ON public.conversations;
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON public.conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tasks_updated_at ON public.tasks;
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_agent_configs_updated_at ON public.agent_configs;
CREATE TRIGGER update_agent_configs_updated_at BEFORE UPDATE ON public.agent_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
