-- Persistent Memory System Tables

-- Agent memories - long-term storage for agent learning
CREATE TABLE IF NOT EXISTS public.agent_memories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  memory_type TEXT CHECK (memory_type IN ('preference', 'fact', 'interaction', 'learning', 'feedback', 'context')) NOT NULL,
  content TEXT NOT NULL,
  context JSONB,
  importance FLOAT DEFAULT 0.5 CHECK (importance >= 0 AND importance <= 1),
  access_count INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMPTZ,
  embedding vector(1536), -- For semantic search
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent learning events - track what agents learn over time
CREATE TABLE IF NOT EXISTS public.agent_learning_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
  event_type TEXT CHECK (event_type IN ('skill_acquired', 'preference_learned', 'pattern_recognized', 'error_corrected', 'feedback_received')) NOT NULL,
  description TEXT NOT NULL,
  before_state JSONB,
  after_state JSONB,
  confidence FLOAT CHECK (confidence >= 0 AND confidence <= 1),
  source TEXT, -- Where the learning came from (conversation_id, user feedback, etc.)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User preferences - what agents learn about users
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
  preference_key TEXT NOT NULL,
  preference_value JSONB NOT NULL,
  confidence FLOAT DEFAULT 0.5 CHECK (confidence >= 0 AND confidence <= 1),
  learned_from TEXT, -- conversation_id or manual
  times_reinforced INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, agent_id, preference_key)
);

-- Agent evolution tracking - how agents change over time
CREATE TABLE IF NOT EXISTS public.agent_evolution (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  changes JSONB NOT NULL,
  reason TEXT,
  harmony_score_delta FLOAT,
  ethics_alignment_delta FLOAT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Memory retrieval log - track what memories are accessed
CREATE TABLE IF NOT EXISTS public.memory_retrieval_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
  memory_id UUID REFERENCES public.agent_memories(id) ON DELETE CASCADE,
  conversation_id UUID,
  relevance_score FLOAT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.agent_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_learning_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_evolution ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memory_retrieval_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own agent memories" ON public.agent_memories FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can create agent memories" ON public.agent_memories FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can update own agent memories" ON public.agent_memories FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can view learning events" ON public.agent_learning_events FOR SELECT USING (true);
CREATE POLICY "Anyone can create learning events" ON public.agent_learning_events FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own preferences" ON public.user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own preferences" ON public.user_preferences FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view agent evolution" ON public.agent_evolution FOR SELECT USING (true);
CREATE POLICY "Anyone can track agent evolution" ON public.agent_evolution FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view memory retrieval logs" ON public.memory_retrieval_log FOR SELECT USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS agent_memories_agent_id_idx ON public.agent_memories(agent_id);
CREATE INDEX IF NOT EXISTS agent_memories_user_id_idx ON public.agent_memories(user_id);
CREATE INDEX IF NOT EXISTS agent_memories_type_idx ON public.agent_memories(memory_type);
CREATE INDEX IF NOT EXISTS agent_memories_importance_idx ON public.agent_memories(importance DESC);
CREATE INDEX IF NOT EXISTS agent_learning_events_agent_id_idx ON public.agent_learning_events(agent_id);
CREATE INDEX IF NOT EXISTS user_preferences_user_id_idx ON public.user_preferences(user_id);
CREATE INDEX IF NOT EXISTS user_preferences_agent_id_idx ON public.user_preferences(agent_id);
CREATE INDEX IF NOT EXISTS agent_evolution_agent_id_idx ON public.agent_evolution(agent_id);

-- Trigger for updated_at
CREATE TRIGGER update_agent_memories_updated_at BEFORE UPDATE ON public.agent_memories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON public.user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
