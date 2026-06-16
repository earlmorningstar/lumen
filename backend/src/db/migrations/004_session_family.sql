-- Add token family column for refresh token rotation tracking
ALTER TABLE user_sessions
ADD COLUMN IF NOT EXISTS family UUID NOT NULL DEFAULT gen_random_uuid();

-- Index on family for replay attack detection queries
CREATE INDEX IF NOT EXISTS idx_user_sessions_family ON user_sessions(family);