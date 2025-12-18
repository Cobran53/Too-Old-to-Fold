/* EMPTY FILE */
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS workouts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  duration INTEGER DEFAULT 0,
  metadata TEXT,
  created_at DATETIME DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE INDEX IF NOT EXISTS idx_workouts_title ON workouts(title);

-- Table for periodic activity logs (15 minutes)
CREATE TABLE IF NOT EXISTS activity_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  avg_speed REAL,
  gyro_movement REAL,
  steps INTEGER,
  latitude REAL,
  longitude REAL,
  timestamp TEXT,
  day_of_week TEXT,
  created_at DATETIME DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE INDEX IF NOT EXISTS idx_activity_log_timestamp ON activity_log(timestamp);
