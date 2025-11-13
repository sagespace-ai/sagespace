-- Add domain charter fields to sage_personas table

ALTER TABLE sage_personas 
ADD COLUMN IF NOT EXISTS domain_scope TEXT,
ADD COLUMN IF NOT EXISTS off_scope TEXT,
ADD COLUMN IF NOT EXISTS responsibilities TEXT,
ADD COLUMN IF NOT EXISTS uniqueness_goal TEXT;

-- Update existing sage personas with default domain charters
UPDATE sage_personas
SET 
  domain_scope = 'General knowledge and assistance',
  off_scope = 'Specialized professional advice requiring credentials',
  responsibilities = 'Provide helpful, accurate information within scope',
  uniqueness_goal = 'Offer distinct perspective based on role and background'
WHERE domain_scope IS NULL;

-- Add domain charter fields to agents table
ALTER TABLE agents
ADD COLUMN IF NOT EXISTS domain_scope TEXT,
ADD COLUMN IF NOT EXISTS off_scope TEXT,
ADD COLUMN IF NOT EXISTS responsibilities TEXT,
ADD COLUMN IF NOT EXISTS uniqueness_goal TEXT;

COMMENT ON COLUMN sage_personas.domain_scope IS 'What domains this Sage is responsible for';
COMMENT ON COLUMN sage_personas.off_scope IS 'What this Sage must defer on';
COMMENT ON COLUMN sage_personas.responsibilities IS 'What this Sage must add in Council';
COMMENT ON COLUMN sage_personas.uniqueness_goal IS 'How this Sage avoids duplication';
