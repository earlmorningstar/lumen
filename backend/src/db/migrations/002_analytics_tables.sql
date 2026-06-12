CREATE TABLE analytics_events (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id VARCHAR(255) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    content_id UUID REFERENCES content(id) ON DELETE SET NULL,
    properties JSONB DEFAULT '{}',
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_analytics_events_type_time ON analytics_events(event_type, occurred_at DESC);
CREATE INDEX idx_analytics_events_content_type ON analytics_events(content_id, event_type);
CREATE INDEX idx_analytics_events_user_time ON analytics_events(user_id, occurred_at DESC);

CREATE TABLE analytics_content_metrics (
    content_id UUID PRIMARY KEY REFERENCES content(id) ON DELETE CASCADE,
    total_views BIGINT DEFAULT 0,
    total_watch_sec BIGINT DEFAULT 0,
    completion_rate FLOAT DEFAULT 0,
    avg_watch_pct FLOAT DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);