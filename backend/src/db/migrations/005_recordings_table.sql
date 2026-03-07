-- Recordings table for mock interview and tab recording
CREATE TABLE IF NOT EXISTS recordings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  recording_type VARCHAR(50) NOT NULL CHECK (recording_type IN ('mock_interview', 'tab_recording')),
  video_url TEXT NOT NULL,
  mic_url TEXT,
  ai_url TEXT,
  transcript JSONB,
  summary TEXT,
  duration_seconds INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recordings_user_id ON recordings(user_id);
CREATE INDEX IF NOT EXISTS idx_recordings_session_id ON recordings(session_id);
CREATE INDEX IF NOT EXISTS idx_recordings_recording_type ON recordings(recording_type);
CREATE INDEX IF NOT EXISTS idx_recordings_created_at ON recordings(created_at DESC);
