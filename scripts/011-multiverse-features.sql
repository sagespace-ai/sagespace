-- Add multiverse-specific columns to conversations
ALTER TABLE public.conversations 
ADD COLUMN IF NOT EXISTS agent_role TEXT,
ADD COLUMN IF NOT EXISTS agent_avatar TEXT,
ADD COLUMN IF NOT EXISTS message_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_message_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Create agent_configs table for modular role definitions
CREATE TABLE IF NOT EXISTS public.agent_configs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  description TEXT,
  avatar TEXT,
  purpose TEXT,
  tone TEXT,
  modality TEXT,
  capabilities TEXT,
  system_prompt TEXT,
  config_json JSONB NOT NULL DEFAULT '{}'::JSONB,
  is_custom BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create knowledge_anchors table for RAG
CREATE TABLE IF NOT EXISTS public.knowledge_anchors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL,
  type TEXT CHECK (type IN ('file', 'url', 'text', 'code')) NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  url TEXT,
  file_path TEXT,
  embedding VECTOR(1536),
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create agent_fusions table for hybrid agents
CREATE TABLE IF NOT EXISTS public.agent_fusions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  primary_agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
  fusion_config JSONB NOT NULL,
  agent_weights JSONB NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create agent_growth table for XP and maturity
CREATE TABLE IF NOT EXISTS public.agent_growth (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  maturity_score DECIMAL(5,2) DEFAULT 0.0,
  interactions_count INTEGER DEFAULT 0,
  successful_tasks INTEGER DEFAULT 0,
  skills_acquired TEXT[] DEFAULT '{}',
  achievements JSONB DEFAULT '[]'::JSONB,
  last_xp_gain TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(agent_id)
);

-- Create shared_conversations table
CREATE TABLE IF NOT EXISTS public.shared_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  share_token TEXT UNIQUE NOT NULL,
  is_public BOOLEAN DEFAULT TRUE,
  view_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(conversation_id)
);

-- Enable RLS
ALTER TABLE public.agent_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_anchors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_fusions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_growth ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_conversations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own agent configs" ON public.agent_configs FOR SELECT USING (auth.uid() = user_id OR is_public = TRUE);
CREATE POLICY "Users can create own agent configs" ON public.agent_configs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own agent configs" ON public.agent_configs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own agent configs" ON public.agent_configs FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own knowledge anchors" ON public.knowledge_anchors FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own knowledge anchors" ON public.knowledge_anchors FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own agent fusions" ON public.agent_fusions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own agent fusions" ON public.agent_fusions FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view agent growth" ON public.agent_growth FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.agents WHERE agents.id = agent_growth.agent_id AND (agents.user_id = auth.uid() OR agents.user_id IS NULL))
);
CREATE POLICY "System can manage agent growth" ON public.agent_growth FOR ALL USING (TRUE);

CREATE POLICY "Anyone can view public shared conversations" ON public.shared_conversations FOR SELECT USING (is_public = TRUE);
CREATE POLICY "Users can manage own shared conversations" ON public.shared_conversations FOR ALL USING (
  EXISTS (SELECT 1 FROM public.conversations WHERE conversations.id = shared_conversations.conversation_id AND conversations.user_id = auth.uid())
);

-- Indexes
CREATE INDEX IF NOT EXISTS agent_configs_user_id_idx ON public.agent_configs(user_id);
CREATE INDEX IF NOT EXISTS knowledge_anchors_conversation_id_idx ON public.knowledge_anchors(conversation_id);
CREATE INDEX IF NOT EXISTS agent_growth_agent_id_idx ON public.agent_growth(agent_id);
CREATE INDEX IF NOT EXISTS shared_conversations_token_idx ON public.shared_conversations(share_token);

-- Triggers
CREATE TRIGGER update_agent_configs_updated_at BEFORE UPDATE ON public.agent_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_agent_growth_updated_at BEFORE UPDATE ON public.agent_growth FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
