-- ISO 42001 Compliance Audit Logs
-- Tracks all AI operations with full provenance and risk classification

CREATE TABLE IF NOT EXISTS compliance_audit_logs (
  id TEXT PRIMARY KEY,
  correlation_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Who/What
  user_id UUID REFERENCES auth.users(id),
  session_id UUID,
  agent_id TEXT,
  
  -- Input Data
  input_summary TEXT NOT NULL,
  input_token_count INTEGER NOT NULL,
  data_sources TEXT[] NOT NULL, -- ['user-input', 'external-integration', etc.]
  
  -- Model Information
  model_provider TEXT NOT NULL, -- 'groq', 'gateway', 'huggingface'
  model_id TEXT NOT NULL,
  model_version TEXT NOT NULL,
  routing_reason TEXT NOT NULL,
  processing_time_ms INTEGER,
  
  -- Output Data
  output_summary TEXT NOT NULL,
  output_token_count INTEGER NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  risk_factors TEXT[],
  
  -- Compliance Checks
  guardrails_passed BOOLEAN NOT NULL DEFAULT false,
  requires_human_review BOOLEAN NOT NULL DEFAULT false,
  human_review_completed BOOLEAN DEFAULT false,
  human_reviewer_id UUID REFERENCES auth.users(id),
  human_review_notes TEXT,
  human_review_timestamp TIMESTAMP WITH TIME ZONE,
  
  -- Governance
  governance_checks_passed BOOLEAN NOT NULL DEFAULT false,
  governance_violations TEXT[],
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_compliance_logs_user_id ON compliance_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_compliance_logs_correlation_id ON compliance_audit_logs(correlation_id);
CREATE INDEX IF NOT EXISTS idx_compliance_logs_risk_level ON compliance_audit_logs(risk_level);
CREATE INDEX IF NOT EXISTS idx_compliance_logs_created_at ON compliance_audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_compliance_logs_requires_review ON compliance_audit_logs(requires_human_review) WHERE requires_human_review = true;

-- RLS Policies
ALTER TABLE compliance_audit_logs ENABLE ROW LEVEL SECURITY;

-- Users can view their own audit logs
CREATE POLICY "Users can view own compliance logs"
  ON compliance_audit_logs
  FOR SELECT
  USING (auth.uid() = user_id);

-- Only system can insert (via service role)
CREATE POLICY "Service role can insert compliance logs"
  ON compliance_audit_logs
  FOR INSERT
  WITH CHECK (true);

-- Human reviewers can update review fields
CREATE POLICY "Reviewers can update review fields"
  ON compliance_audit_logs
  FOR UPDATE
  USING (auth.uid() = human_reviewer_id OR auth.uid() IN (SELECT user_id FROM profiles WHERE metadata->>'role' = 'reviewer'));

-- Agent Integration Permissions
-- Tracks which integrations each agent is allowed to use

CREATE TABLE IF NOT EXISTS agent_integration_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL,
  integration_type TEXT NOT NULL, -- 'spotify', 'notion', 'github', etc.
  user_id UUID NOT NULL REFERENCES auth.users(id),
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  revoked_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high')),
  requires_approval_per_use BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_agent_integration_perms_agent_id ON agent_integration_permissions(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_integration_perms_user_id ON agent_integration_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_integration_perms_active ON agent_integration_permissions(is_active) WHERE is_active = true;

-- RLS Policies
ALTER TABLE agent_integration_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own agent permissions"
  ON agent_integration_permissions
  FOR ALL
  USING (auth.uid() = user_id);

-- Agent Execution History
-- Tracks every time an agent executes with integrations

CREATE TABLE IF NOT EXISTS agent_execution_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  execution_type TEXT NOT NULL, -- 'chat', 'workflow', 'scheduled'
  integrations_used TEXT[],
  input_summary TEXT NOT NULL,
  output_summary TEXT NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  compliance_checks_passed BOOLEAN NOT NULL DEFAULT false,
  execution_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_agent_execution_agent_id ON agent_execution_history(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_execution_user_id ON agent_execution_history(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_execution_created_at ON agent_execution_history(created_at DESC);

-- RLS Policies
ALTER TABLE agent_execution_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own agent executions"
  ON agent_execution_history
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert agent executions"
  ON agent_execution_history
  FOR INSERT
  WITH CHECK (true);
