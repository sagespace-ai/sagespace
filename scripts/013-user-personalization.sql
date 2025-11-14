-- User personalization and AI proposal system for self-healing, evolving platform
-- This enables per-user UX customization, AI-driven improvement proposals, and governance

-- Main personalization table
CREATE TABLE IF NOT EXISTS user_personalization (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- UX Preferences (layout, density, animations, etc.)
  ux_preferences JSONB DEFAULT '{
    "theme": "cosmic",
    "density": "comfortable",
    "animations": true,
    "navigationStyle": "sidebar",
    "fontSize": "medium",
    "colorAccent": "cyan"
  }'::jsonb,
  
  -- User-controlled feature flags
  feature_flags JSONB DEFAULT '{}'::jsonb,
  
  -- Pending AI suggestions (from Dreamer system)
  ai_proposals JSONB DEFAULT '{
    "pendingChanges": [],
    "approvedCount": 0,
    "rejectedCount": 0,
    "reviewStreak": 0
  }'::jsonb,
  
  -- Summarized long-term memory about user behavior
  memory_summary JSONB DEFAULT '{
    "favoriteFeatures": [],
    "usagePatterns": {},
    "preferredSages": [],
    "avoidedFeatures": [],
    "peakActivityHours": []
  }'::jsonb,
  
  -- Observability signals
  observability_data JSONB DEFAULT '{
    "navigationPatterns": [],
    "timeOnPage": {},
    "frictionPoints": [],
    "successSignals": [],
    "lastCollectedAt": null
  }'::jsonb,
  
  -- Governance and safety
  governance_context JSONB DEFAULT '{
    "safetyLevel": "moderate",
    "complianceFlags": [],
    "restrictedFeatures": []
  }'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Observability events table (tracks user behavior for Dreamer analysis)
CREATE TABLE IF NOT EXISTS observability_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NULL,
  
  event_type TEXT NOT NULL, -- 'page_view', 'click', 'abandon', 'success', 'error', etc.
  event_category TEXT NOT NULL, -- 'navigation', 'interaction', 'completion', 'friction'
  
  page_path TEXT,
  component_name TEXT,
  action_name TEXT,
  
  metadata JSONB DEFAULT '{}'::jsonb, -- context, duration, etc.
  
  session_id UUID, -- links to user_sessions table
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI proposal history table (tracks all proposals generated and their outcomes)
CREATE TABLE IF NOT EXISTS ai_proposal_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  proposal_type TEXT NOT NULL, -- 'ux_change', 'feature_toggle', 'workflow_automation', etc.
  proposal_title TEXT NOT NULL,
  proposal_description TEXT NOT NULL,
  
  expected_benefit TEXT,
  impact_level TEXT CHECK (impact_level IN ('low', 'medium', 'high')),
  
  -- The actual change being proposed
  proposed_changes JSONB NOT NULL,
  
  -- Reasoning from Dreamer AI
  ai_reasoning TEXT,
  generated_by TEXT DEFAULT 'dreamer_v1',
  
  -- User decision
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'applied')),
  user_decision_at TIMESTAMP WITH TIME ZONE,
  user_feedback TEXT,
  
  -- Governance check
  governance_approved BOOLEAN DEFAULT false,
  governance_reasoning TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  applied_at TIMESTAMP WITH TIME ZONE
);

-- Self-healing events table (tracks system issues and auto-fix attempts)
CREATE TABLE IF NOT EXISTS self_healing_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  event_type TEXT NOT NULL, -- 'slow_response', 'error', 'broken_route', 'hallucination', etc.
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  
  affected_component TEXT,
  error_details JSONB,
  
  -- Auto-fix proposal
  proposed_fix TEXT,
  fix_applied BOOLEAN DEFAULT false,
  fix_successful BOOLEAN,
  
  -- Requires user approval for non-critical fixes
  requires_user_approval BOOLEAN DEFAULT false,
  user_approved BOOLEAN,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Design Karma / Architect Level tracking (gamification)
CREATE TABLE IF NOT EXISTS user_design_karma (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  karma_points INTEGER DEFAULT 0,
  architect_level INTEGER DEFAULT 1,
  
  proposals_reviewed INTEGER DEFAULT 0,
  proposals_approved INTEGER DEFAULT 0,
  proposals_rejected INTEGER DEFAULT 0,
  
  review_streak INTEGER DEFAULT 0,
  longest_review_streak INTEGER DEFAULT 0,
  
  last_review_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_observability_events_user_id ON observability_events(user_id);
CREATE INDEX IF NOT EXISTS idx_observability_events_created_at ON observability_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_observability_events_type ON observability_events(event_type, event_category);

CREATE INDEX IF NOT EXISTS idx_ai_proposal_history_user_id ON ai_proposal_history(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_proposal_history_status ON ai_proposal_history(status);
CREATE INDEX IF NOT EXISTS idx_ai_proposal_history_created_at ON ai_proposal_history(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_self_healing_events_created_at ON self_healing_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_self_healing_events_severity ON self_healing_events(severity);

-- Enable Row Level Security
ALTER TABLE user_personalization ENABLE ROW LEVEL SECURITY;
ALTER TABLE observability_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_proposal_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE self_healing_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_design_karma ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_personalization
CREATE POLICY "Users can view own personalization"
  ON user_personalization FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own personalization"
  ON user_personalization FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own personalization"
  ON user_personalization FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for observability_events
CREATE POLICY "Users can view own events"
  ON observability_events FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can insert events"
  ON observability_events FOR INSERT
  WITH CHECK (true);

-- RLS Policies for ai_proposal_history
CREATE POLICY "Users can view own proposals"
  ON ai_proposal_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own proposals"
  ON ai_proposal_history FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for self_healing_events (admins can view all, users can view affecting them)
CREATE POLICY "Anyone can view self-healing events"
  ON self_healing_events FOR SELECT
  USING (true);

-- RLS Policies for user_design_karma
CREATE POLICY "Users can view own karma"
  ON user_design_karma FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own karma"
  ON user_design_karma FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own karma"
  ON user_design_karma FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_personalization_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_personalization_timestamp
  BEFORE UPDATE ON user_personalization
  FOR EACH ROW
  EXECUTE FUNCTION update_personalization_timestamp();
