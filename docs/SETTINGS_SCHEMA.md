# Settings Schema Documentation

## Overview
SageSpace uses a flexible JSON-based settings system stored in the `settings` table with RLS policies ensuring users can only access their own settings.

## Database Schema

\`\`\`sql
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  category TEXT NOT NULL, -- e.g., 'profile', 'privacy', 'notifications'
  key TEXT NOT NULL,
  value JSONB NOT NULL,
  type TEXT, -- 'boolean', 'string', 'number', 'object'
  description TEXT,
  UNIQUE(user_id, category, key)
);
\`\`\`

## Settings Categories

### 1. Profile Settings
\`\`\`typescript
{
  handle: string;         // Unique username
  bio: string;           // User biography
  avatar_url: string;    // Profile picture URL
  banner_url: string;    // Profile banner URL
  visibility: 'public' | 'followers' | 'private';
  locale: string;        // Language preference
}
\`\`\`

### 2. Security Settings
\`\`\`typescript
{
  two_factor_enabled: boolean;
  passkey_enabled: boolean;
  active_sessions: Session[];
  trusted_devices: Device[];
}
\`\`\`

### 3. Notification Settings
\`\`\`typescript
{
  notify_follows: boolean;
  notify_remixes: boolean;
  notify_collaborations: boolean;
  notify_payouts: boolean;
  daily_digest: boolean;
  digest_time: string; // HH:MM format
}
\`\`\`

### 4. Privacy & Data Settings
\`\`\`typescript
{
  show_activity: boolean;
  allow_indexing: boolean;
  retention_days: number; // 30-365
  pii_redaction: boolean;
  memory_sharing: 'private' | 'followers' | 'public';
}
\`\`\`

### 5. Appearance Settings
\`\`\`typescript
{
  theme: 'light' | 'dark' | 'system';
  reduce_motion: boolean;
  feed_density: 'compact' | 'comfortable' | 'spacious';
  font_size: 'small' | 'medium' | 'large';
}
\`\`\`

### 6. Studio Defaults
\`\`\`typescript
{
  default_visibility: 'public' | 'unlisted' | 'private';
  safety_level: 'strict' | 'moderate' | 'permissive';
  tool_budget: number; // Daily credit limit
  auto_watermark: boolean;
  default_provenance: boolean;
}
\`\`\`

## Usage Example

\`\`\`typescript
// Fetch user settings
const { data: settings } = await supabase
  .from('settings')
  .select('*')
  .eq('user_id', userId)
  .eq('category', 'privacy');

// Update setting
await supabase
  .from('settings')
  .upsert({
    user_id: userId,
    category: 'privacy',
    key: 'retention_days',
    value: 90,
    type: 'number'
  });
\`\`\`

## Audit Logging

All settings changes are automatically logged to `audit_events` table for compliance and rollback capabilities.
