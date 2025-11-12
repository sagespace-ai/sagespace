-- Add policies table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.policies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  version TEXT NOT NULL,
  rules JSONB NOT NULL,
  effective_from TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(name, version)
);

-- Enable RLS
ALTER TABLE public.policies ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Anyone can view policies" ON public.policies FOR SELECT USING (true);
CREATE POLICY "Allow anonymous policy creation" ON public.policies FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous policy updates" ON public.policies FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous policy deletion" ON public.policies FOR DELETE USING (true);

-- Create index
CREATE INDEX IF NOT EXISTS policies_name_idx ON public.policies(name);
