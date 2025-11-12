-- Agent-to-Agent Collaboration Tables

-- Agent conversations - tracks inter-agent communications
CREATE TABLE IF NOT EXISTS public.agent_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  trigger_type TEXT CHECK (trigger_type IN ('automatic', 'manual', 'threshold', 'council')) NOT NULL,
  trigger_reason TEXT,
  status TEXT CHECK (status IN ('active', 'paused', 'completed', 'archived')) DEFAULT 'active',
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Agent messages - messages between agents
CREATE TABLE IF NOT EXISTS public.agent_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.agent_conversations(id) ON DELETE CASCADE,
  from_agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
  to_agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL, -- NULL means broadcast to all
  message_type TEXT CHECK (message_type IN ('request', 'response', 'broadcast', 'query', 'data', 'decision')) NOT NULL,
  content TEXT NOT NULL,
  context JSONB,
  requires_response BOOLEAN DEFAULT FALSE,
  parent_message_id UUID REFERENCES public.agent_messages(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent collaboration triggers - rules for when agents should interact
CREATE TABLE IF NOT EXISTS public.collaboration_triggers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  trigger_condition JSONB NOT NULL, -- e.g., { "keywords": ["ethics", "safety"], "threshold": "moral" }
  primary_agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
  collaborator_agent_ids UUID[] NOT NULL,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent interactions log - tracks all agent-to-agent interactions
CREATE TABLE IF NOT EXISTS public.agent_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.agent_conversations(id) ON DELETE CASCADE,
  agent_a_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
  agent_b_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
  interaction_type TEXT CHECK (interaction_type IN ('collaboration', 'conflict', 'consensus', 'handoff', 'review')) NOT NULL,
  outcome TEXT,
  confidence FLOAT CHECK (confidence >= 0 AND confidence <= 1),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.agent_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_triggers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_interactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own agent conversations" ON public.agent_conversations FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can create agent conversations" ON public.agent_conversations FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can update own agent conversations" ON public.agent_conversations FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can view agent messages" ON public.agent_messages FOR SELECT USING (true);
CREATE POLICY "Anyone can create agent messages" ON public.agent_messages FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can manage collaboration triggers" ON public.collaboration_triggers FOR ALL USING (true);
CREATE POLICY "Anyone can view agent interactions" ON public.agent_interactions FOR SELECT USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS agent_conversations_user_id_idx ON public.agent_conversations(user_id);
CREATE INDEX IF NOT EXISTS agent_conversations_status_idx ON public.agent_conversations(status);
CREATE INDEX IF NOT EXISTS agent_messages_conversation_id_idx ON public.agent_messages(conversation_id);
CREATE INDEX IF NOT EXISTS agent_messages_from_agent_idx ON public.agent_messages(from_agent_id);
CREATE INDEX IF NOT EXISTS agent_messages_to_agent_idx ON public.agent_messages(to_agent_id);
CREATE INDEX IF NOT EXISTS collaboration_triggers_primary_agent_idx ON public.collaboration_triggers(primary_agent_id);
CREATE INDEX IF NOT EXISTS agent_interactions_conversation_id_idx ON public.agent_interactions(conversation_id);
