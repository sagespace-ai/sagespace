-- Sage Live Sessions Database Schema
-- Supports creator dashboards, live streaming, monetization, and compliance

-- Creator profiles and Sage Twin definitions
CREATE TABLE IF NOT EXISTS live_session_creators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  
  -- Verification and status
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  
  -- Platform connections
  instagram_connected BOOLEAN DEFAULT FALSE,
  tiktok_connected BOOLEAN DEFAULT FALSE,
  youtube_connected BOOLEAN DEFAULT FALSE,
  twitch_connected BOOLEAN DEFAULT FALSE,
  rtmp_stream_key TEXT,
  rtmp_server_url TEXT,
  
  -- Analytics
  total_sessions INTEGER DEFAULT 0,
  total_viewers INTEGER DEFAULT 0,
  total_revenue DECIMAL(10, 2) DEFAULT 0,
  follower_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- Sage Twin personas for live sessions (linked to creators)
CREATE TABLE IF NOT EXISTS sage_twins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES live_session_creators(id) ON DELETE CASCADE,
  
  -- Twin identity
  twin_name TEXT NOT NULL,
  description TEXT,
  avatar_url TEXT,
  voice_sample_url TEXT,
  
  -- Personality configuration
  personality_traits JSONB DEFAULT '{}',
  speaking_style TEXT,
  knowledge_domains TEXT[],
  response_tone TEXT DEFAULT 'balanced' CHECK (response_tone IN ('professional', 'casual', 'energetic', 'balanced', 'witty')),
  
  -- AI configuration
  system_prompt TEXT,
  temperature DECIMAL(3, 2) DEFAULT 0.7,
  max_tokens INTEGER DEFAULT 150,
  
  -- Compliance settings
  content_filter_level TEXT DEFAULT 'moderate' CHECK (content_filter_level IN ('strict', 'moderate', 'relaxed')),
  allowed_topics TEXT[],
  blocked_topics TEXT[],
  requires_human_approval BOOLEAN DEFAULT FALSE,
  
  -- Licensing and rights
  voice_license_acknowledged BOOLEAN DEFAULT FALSE,
  avatar_license_acknowledged BOOLEAN DEFAULT FALSE,
  rights_expiration_date TIMESTAMPTZ,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  training_status TEXT DEFAULT 'draft' CHECK (training_status IN ('draft', 'training', 'ready', 'archived')),
  
  -- Memory and context
  memory_enabled BOOLEAN DEFAULT TRUE,
  context_window_size INTEGER DEFAULT 10,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Live session definitions
CREATE TABLE IF NOT EXISTS live_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES live_session_creators(id) ON DELETE CASCADE,
  sage_twin_id UUID REFERENCES sage_twins(id) ON DELETE SET NULL,
  
  -- Session details
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  
  -- Scheduling
  scheduled_start TIMESTAMPTZ,
  scheduled_end TIMESTAMPTZ,
  actual_start TIMESTAMPTZ,
  actual_end TIMESTAMPTZ,
  
  -- Status
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'ended', 'cancelled')),
  
  -- Platform configuration
  streaming_platforms TEXT[] DEFAULT ARRAY['sagespace'],
  rtmp_urls JSONB DEFAULT '{}',
  
  -- Session settings
  allow_chat BOOLEAN DEFAULT TRUE,
  allow_questions BOOLEAN DEFAULT TRUE,
  allow_tips BOOLEAN DEFAULT TRUE,
  enable_sage_twin BOOLEAN DEFAULT TRUE,
  safe_mode_enabled BOOLEAN DEFAULT TRUE,
  
  -- Analytics
  peak_viewers INTEGER DEFAULT 0,
  total_messages INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 0,
  total_tips_usd DECIMAL(10, 2) DEFAULT 0,
  engagement_score DECIMAL(5, 2) DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Live session messages (chat)
CREATE TABLE IF NOT EXISTS live_session_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES live_sessions(id) ON DELETE CASCADE,
  
  -- Message details
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  username TEXT NOT NULL,
  message_text TEXT NOT NULL,
  
  -- Source platform
  platform TEXT DEFAULT 'sagespace' CHECK (platform IN ('sagespace', 'instagram', 'tiktok', 'youtube', 'twitch')),
  external_user_id TEXT,
  
  -- Message type
  message_type TEXT DEFAULT 'chat' CHECK (message_type IN ('chat', 'question', 'tip', 'system', 'sage_response')),
  
  -- Moderation
  is_moderated BOOLEAN DEFAULT FALSE,
  moderation_status TEXT CHECK (moderation_status IN ('approved', 'flagged', 'removed')),
  moderation_reason TEXT,
  
  -- Engagement
  is_pinned BOOLEAN DEFAULT FALSE,
  is_highlighted BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sage Twin responses during live sessions
CREATE TABLE IF NOT EXISTS sage_twin_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES live_sessions(id) ON DELETE CASCADE,
  sage_twin_id UUID NOT NULL REFERENCES sage_twins(id) ON DELETE CASCADE,
  
  -- Question and response
  question_message_id UUID REFERENCES live_session_messages(id) ON DELETE SET NULL,
  question_text TEXT NOT NULL,
  response_text TEXT NOT NULL,
  
  -- AI metadata
  model_used TEXT,
  tokens_used INTEGER,
  generation_time_ms INTEGER,
  confidence_score DECIMAL(3, 2),
  
  -- Compliance
  passed_compliance BOOLEAN DEFAULT TRUE,
  compliance_flags TEXT[],
  human_approved BOOLEAN,
  approved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Engagement
  likes_count INTEGER DEFAULT 0,
  was_read_aloud BOOLEAN DEFAULT FALSE,
  
  -- Watermark
  ai_watermark TEXT NOT NULL DEFAULT 'Generated by AI',
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Live session tips and monetization
CREATE TABLE IF NOT EXISTS live_session_tips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES live_sessions(id) ON DELETE CASCADE,
  
  -- Tipper details
  tipper_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  tipper_username TEXT NOT NULL,
  
  -- Tip details
  amount_usd DECIMAL(10, 2) NOT NULL,
  message TEXT,
  
  -- Payment
  stripe_payment_intent_id TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  
  -- Revenue split
  creator_earnings DECIMAL(10, 2),
  platform_fee DECIMAL(10, 2),
  
  -- Display
  is_anonymous BOOLEAN DEFAULT FALSE,
  is_highlighted BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Digital collectibles (Sage Cards) purchased during sessions
CREATE TABLE IF NOT EXISTS sage_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES live_sessions(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES live_session_creators(id) ON DELETE CASCADE,
  
  -- Card details
  card_name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  
  -- Pricing
  price_usd DECIMAL(10, 2) NOT NULL,
  limited_quantity INTEGER,
  sold_count INTEGER DEFAULT 0,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sage Card purchases
CREATE TABLE IF NOT EXISTS sage_card_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID NOT NULL REFERENCES sage_cards(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES live_sessions(id) ON DELETE CASCADE,
  
  -- Buyer details
  buyer_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Payment
  price_paid DECIMAL(10, 2) NOT NULL,
  stripe_payment_intent_id TEXT,
  
  -- Ownership
  is_tradeable BOOLEAN DEFAULT TRUE,
  
  purchased_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compliance and audit logs for live sessions
CREATE TABLE IF NOT EXISTS live_session_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES live_sessions(id) ON DELETE CASCADE,
  
  -- Event details
  event_type TEXT NOT NULL CHECK (event_type IN ('session_started', 'session_ended', 'sage_response', 'message_moderated', 'compliance_flag', 'emergency_stop')),
  event_description TEXT,
  
  -- Actor
  actor_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  actor_type TEXT CHECK (actor_type IN ('creator', 'moderator', 'system', 'sage_twin')),
  
  -- Data
  event_data JSONB DEFAULT '{}',
  
  -- Compliance
  compliance_level TEXT,
  requires_review BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Session highlights and clips
CREATE TABLE IF NOT EXISTS session_highlights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES live_sessions(id) ON DELETE CASCADE,
  
  -- Highlight details
  title TEXT NOT NULL,
  description TEXT,
  timestamp_start INTEGER NOT NULL, -- seconds from session start
  timestamp_end INTEGER NOT NULL,
  
  -- Media
  video_url TEXT,
  thumbnail_url TEXT,
  
  -- Engagement
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  
  -- Visibility
  is_public BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Polls during live sessions
CREATE TABLE IF NOT EXISTS live_session_polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES live_sessions(id) ON DELETE CASCADE,
  
  -- Poll details
  question TEXT NOT NULL,
  options JSONB NOT NULL, -- Array of {id, text, votes}
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  
  -- Results
  total_votes INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Poll votes
CREATE TABLE IF NOT EXISTS live_session_poll_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID NOT NULL REFERENCES live_session_polls(id) ON DELETE CASCADE,
  
  -- Voter details
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  option_id TEXT NOT NULL,
  
  voted_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(poll_id, user_id)
);

-- RLS Policies

-- Creators can manage their own profiles
ALTER TABLE live_session_creators ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Creators can view own profile" ON live_session_creators FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Creators can update own profile" ON live_session_creators FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can create creator profile" ON live_session_creators FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Public can view active creators" ON live_session_creators FOR SELECT USING (is_active = true);

-- Sage Twins
ALTER TABLE sage_twins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Creators can manage own sage twins" ON sage_twins FOR ALL USING (creator_id IN (SELECT id FROM live_session_creators WHERE user_id = auth.uid()));
CREATE POLICY "Public can view active sage twins" ON sage_twins FOR SELECT USING (is_active = true);

-- Live Sessions
ALTER TABLE live_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Creators can manage own sessions" ON live_sessions FOR ALL USING (creator_id IN (SELECT id FROM live_session_creators WHERE user_id = auth.uid()));
CREATE POLICY "Public can view live and ended sessions" ON live_sessions FOR SELECT USING (status IN ('live', 'ended'));

-- Session Messages
ALTER TABLE live_session_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view session messages" ON live_session_messages FOR SELECT USING (true);
CREATE POLICY "Users can create messages" ON live_session_messages FOR INSERT WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- Sage Twin Responses
ALTER TABLE sage_twin_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view sage responses" ON sage_twin_responses FOR SELECT USING (true);
CREATE POLICY "System can insert sage responses" ON sage_twin_responses FOR INSERT WITH CHECK (true);

-- Tips
ALTER TABLE live_session_tips ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view tips in sessions" ON live_session_tips FOR SELECT USING (true);
CREATE POLICY "Users can create tips" ON live_session_tips FOR INSERT WITH CHECK (tipper_user_id = auth.uid() OR tipper_user_id IS NULL);

-- Sage Cards
ALTER TABLE sage_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active sage cards" ON sage_cards FOR SELECT USING (is_active = true);
CREATE POLICY "Creators can manage own sage cards" ON sage_cards FOR ALL USING (creator_id IN (SELECT id FROM live_session_creators WHERE user_id = auth.uid()));

-- Sage Card Purchases
ALTER TABLE sage_card_purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own purchases" ON sage_card_purchases FOR SELECT USING (buyer_user_id = auth.uid());
CREATE POLICY "Users can purchase cards" ON sage_card_purchases FOR INSERT WITH CHECK (buyer_user_id = auth.uid());

-- Audit Logs
ALTER TABLE live_session_audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Creators can view own session logs" ON live_session_audit_logs FOR SELECT USING (session_id IN (SELECT id FROM live_sessions WHERE creator_id IN (SELECT id FROM live_session_creators WHERE user_id = auth.uid())));
CREATE POLICY "System can insert audit logs" ON live_session_audit_logs FOR INSERT WITH CHECK (true);

-- Highlights
ALTER TABLE session_highlights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view public highlights" ON session_highlights FOR SELECT USING (is_public = true);
CREATE POLICY "Creators can manage own highlights" ON session_highlights FOR ALL USING (session_id IN (SELECT id FROM live_sessions WHERE creator_id IN (SELECT id FROM live_session_creators WHERE user_id = auth.uid())));

-- Polls
ALTER TABLE live_session_polls ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view session polls" ON live_session_polls FOR SELECT USING (true);
CREATE POLICY "Creators can manage own polls" ON live_session_polls FOR ALL USING (session_id IN (SELECT id FROM live_sessions WHERE creator_id IN (SELECT id FROM live_session_creators WHERE user_id = auth.uid())));

-- Poll Votes
ALTER TABLE live_session_poll_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view poll results" ON live_session_poll_votes FOR SELECT USING (true);
CREATE POLICY "Users can vote once per poll" ON live_session_poll_votes FOR INSERT WITH CHECK (user_id = auth.uid());

-- Indexes for performance
CREATE INDEX idx_live_sessions_status ON live_sessions(status);
CREATE INDEX idx_live_sessions_creator ON live_sessions(creator_id);
CREATE INDEX idx_live_sessions_scheduled ON live_sessions(scheduled_start);
CREATE INDEX idx_session_messages_session ON live_session_messages(session_id);
CREATE INDEX idx_session_messages_created ON live_session_messages(created_at);
CREATE INDEX idx_sage_responses_session ON sage_twin_responses(session_id);
CREATE INDEX idx_tips_session ON live_session_tips(session_id);
CREATE INDEX idx_audit_logs_session ON live_session_audit_logs(session_id);
CREATE INDEX idx_highlights_session ON session_highlights(session_id);
CREATE INDEX idx_polls_session ON live_session_polls(session_id);
