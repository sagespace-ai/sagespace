-- Memory Cost Optimization Schema
-- Implements TTL aging, compression flags, and cost tracking

-- Add memory optimization columns to conversations
ALTER TABLE IF EXISTS conversations
ADD COLUMN IF NOT EXISTS compressed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS compression_summary TEXT,
ADD COLUMN IF NOT EXISTS last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS message_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS embeddings_enabled BOOLEAN DEFAULT FALSE;

-- Add index for TTL cleanup
CREATE INDEX IF NOT EXISTS idx_conversations_expires_at 
ON conversations(expires_at) 
WHERE expires_at IS NOT NULL;

-- Add index for last access tracking
CREATE INDEX IF NOT EXISTS idx_conversations_last_accessed 
ON conversations(last_accessed_at);

-- Function to auto-delete expired conversations
CREATE OR REPLACE FUNCTION cleanup_expired_conversations()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM conversations
  WHERE expires_at IS NOT NULL 
  AND expires_at < NOW();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to update last accessed timestamp
CREATE OR REPLACE FUNCTION update_conversation_access()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET last_accessed_at = NOW()
  WHERE id = NEW.conversation_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update access time when messages are added
CREATE TRIGGER IF NOT EXISTS update_conversation_access_trigger
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION update_conversation_access();

-- Add memory cost tracking
CREATE TABLE IF NOT EXISTS memory_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Usage metrics
  total_conversations INTEGER DEFAULT 0,
  total_messages INTEGER DEFAULT 0,
  compressed_conversations INTEGER DEFAULT 0,
  
  -- Cost metrics (even though Groq is free, track for monitoring)
  embeddings_generated INTEGER DEFAULT 0,
  estimated_cost DECIMAL(10,4) DEFAULT 0.00,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, date)
);

-- Enable RLS
ALTER TABLE memory_usage ENABLE ROW LEVEL SECURITY;

-- RLS policies for memory usage
CREATE POLICY "Users can view own memory usage"
ON memory_usage FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "System can insert memory usage"
ON memory_usage FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can update memory usage"
ON memory_usage FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Function to increment memory usage
CREATE OR REPLACE FUNCTION increment_memory_usage(
  p_user_id UUID,
  p_message_count INTEGER DEFAULT 1,
  p_embeddings_count INTEGER DEFAULT 0
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO memory_usage (
    user_id,
    date,
    total_messages,
    embeddings_generated
  )
  VALUES (
    p_user_id,
    CURRENT_DATE,
    p_message_count,
    p_embeddings_count
  )
  ON CONFLICT (user_id, date)
  DO UPDATE SET
    total_messages = memory_usage.total_messages + p_message_count,
    embeddings_generated = memory_usage.embeddings_generated + p_embeddings_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE memory_usage IS 'Tracks memory usage per user per day for cost monitoring (even though Groq is free)';
COMMENT ON FUNCTION cleanup_expired_conversations() IS 'Deletes conversations past their TTL expiry date';
COMMENT ON COLUMN conversations.compressed IS 'True if conversation has been compressed into summary';
COMMENT ON COLUMN conversations.expires_at IS 'When this conversation will be auto-deleted (NULL = never)';
