CREATE TABLE IF NOT EXISTS monitor_logs (
    id SERIAL PRIMARY KEY,
    url VARCHAR(255) NOT NULL,
    status_code INT,
    response_time_ms INT,
    is_up BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index để query cho nhanh
CREATE INDEX idx_created_at ON monitor_logs(created_at);