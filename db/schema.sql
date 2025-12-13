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
