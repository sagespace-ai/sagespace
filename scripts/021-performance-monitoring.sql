-- Performance monitoring tables

CREATE TABLE IF NOT EXISTS performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  rating TEXT CHECK (rating IN ('good', 'needs-improvement', 'poor')),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_agent TEXT,
  url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for querying metrics
CREATE INDEX IF NOT EXISTS idx_performance_metrics_user_id ON performance_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_timestamp ON performance_metrics(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_name ON performance_metrics(metric_name);

-- RLS policies
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts for tracking
CREATE POLICY "Anyone can insert performance metrics"
  ON performance_metrics FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Users can view their own metrics
CREATE POLICY "Users can view own metrics"
  ON performance_metrics FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can view all metrics
CREATE POLICY "Admins can view all metrics"
  ON performance_metrics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

-- Create materialized view for performance dashboard
CREATE MATERIALIZED VIEW IF NOT EXISTS performance_summary AS
SELECT 
  metric_name,
  DATE_TRUNC('hour', timestamp) as hour,
  COUNT(*) as count,
  AVG(metric_value) as avg_value,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY metric_value) as p50,
  PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY metric_value) as p75,
  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY metric_value) as p95,
  COUNT(CASE WHEN rating = 'good' THEN 1 END) as good_count,
  COUNT(CASE WHEN rating = 'needs-improvement' THEN 1 END) as needs_improvement_count,
  COUNT(CASE WHEN rating = 'poor' THEN 1 END) as poor_count
FROM performance_metrics
WHERE timestamp > NOW() - INTERVAL '7 days'
GROUP BY metric_name, hour
ORDER BY hour DESC;

-- Refresh function
CREATE OR REPLACE FUNCTION refresh_performance_summary()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW performance_summary;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE performance_metrics IS 'Stores Web Vitals and custom performance metrics';
COMMENT ON MATERIALIZED VIEW performance_summary IS 'Aggregated performance data for dashboards';
