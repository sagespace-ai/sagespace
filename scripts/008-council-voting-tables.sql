-- Agent Council and Voting System Tables

-- Council sessions table - tracks deliberation sessions
CREATE TABLE IF NOT EXISTS public.council_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  query_type TEXT CHECK (query_type IN ('ethical', 'technical', 'philosophical', 'complex', 'creative')) NOT NULL,
  status TEXT CHECK (status IN ('deliberating', 'voting', 'completed', 'consensus_reached', 'no_consensus')) DEFAULT 'deliberating',
  consensus_threshold FLOAT DEFAULT 0.66 CHECK (consensus_threshold >= 0 AND consensus_threshold <= 1),
  final_decision TEXT,
  reasoning TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Council participants - which agents are in this session
CREATE TABLE IF NOT EXISTS public.council_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.council_sessions(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  weight FLOAT DEFAULT 1.0 CHECK (weight >= 0),
  UNIQUE(session_id, agent_id)
);

-- Agent deliberations - each agent's contribution to the discussion
CREATE TABLE IF NOT EXISTS public.agent_deliberations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.council_sessions(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
  phase TEXT CHECK (phase IN ('analysis', 'deliberation', 'voting', 'reflection')) NOT NULL,
  content TEXT NOT NULL,
  reasoning TEXT,
  confidence FLOAT CHECK (confidence >= 0 AND confidence <= 1),
  cited_laws TEXT[], -- Which of the Five Laws are referenced
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent votes - final decisions from each agent
CREATE TABLE IF NOT EXISTS public.agent_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.council_sessions(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
  vote TEXT CHECK (vote IN ('approve', 'reject', 'abstain', 'conditional')) NOT NULL,
  reasoning TEXT NOT NULL,
  confidence FLOAT CHECK (confidence >= 0 AND confidence <= 1),
  conditions JSONB, -- For conditional votes
  weight FLOAT DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, agent_id)
);

-- Vote results summary - aggregated outcomes
CREATE TABLE IF NOT EXISTS public.vote_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.council_sessions(id) ON DELETE CASCADE UNIQUE,
  total_votes INTEGER NOT NULL,
  approve_count INTEGER DEFAULT 0,
  reject_count INTEGER DEFAULT 0,
  abstain_count INTEGER DEFAULT 0,
  conditional_count INTEGER DEFAULT 0,
  weighted_approval FLOAT,
  consensus_reached BOOLEAN DEFAULT FALSE,
  final_recommendation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.council_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.council_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_deliberations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vote_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own council sessions" ON public.council_sessions FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can create council sessions" ON public.council_sessions FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can update own council sessions" ON public.council_sessions FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can view participants in own sessions" ON public.council_participants FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.council_sessions WHERE council_sessions.id = council_participants.session_id AND (council_sessions.user_id = auth.uid() OR council_sessions.user_id IS NULL))
);

CREATE POLICY "Anyone can view deliberations" ON public.agent_deliberations FOR SELECT USING (true);
CREATE POLICY "Anyone can view votes" ON public.agent_votes FOR SELECT USING (true);
CREATE POLICY "Anyone can view vote results" ON public.vote_results FOR SELECT USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS council_sessions_user_id_idx ON public.council_sessions(user_id);
CREATE INDEX IF NOT EXISTS council_sessions_status_idx ON public.council_sessions(status);
CREATE INDEX IF NOT EXISTS council_participants_session_id_idx ON public.council_participants(session_id);
CREATE INDEX IF NOT EXISTS agent_deliberations_session_id_idx ON public.agent_deliberations(session_id);
CREATE INDEX IF NOT EXISTS agent_votes_session_id_idx ON public.agent_votes(session_id);
