CREATE TABLE IF NOT EXISTS refresh_tokens (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(64) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS content_reports (
    id UUID PRIMARY KEY,
    reporter_id UUID NOT NULL REFERENCES users(id),
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    reason VARCHAR(500) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_content_reports_reporter_article UNIQUE (reporter_id, article_id)
);

CREATE INDEX IF NOT EXISTS idx_content_reports_status_created
    ON content_reports(status, created_at);
