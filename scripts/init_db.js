import fs from 'fs';
import path from 'path';
import sqlite3pkg from 'sqlite3';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sqlite3 = sqlite3pkg.verbose();

const dbDir = path.resolve(__dirname, '..', 'db');
const dbFile = path.join(dbDir, 'database.sqlite');

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

if (fs.existsSync(dbFile)) {
  console.log('Database already exists:', dbFile);
  process.exit(0);
}

const schemaPath = path.join(dbDir, 'schema.sql');
if (!fs.existsSync(schemaPath)) {
  console.error('schema.sql not found in db/ — create db/schema.sql first');
  process.exit(1);
}

const schemaSql = fs.readFileSync(schemaPath, 'utf8');

const db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    console.error('Error creating DB:', err.message);
    process.exit(1);
  }
  console.log('Database created:', dbFile);
  db.exec(schemaSql, (err) => {
    if (err) {
      console.error('Error executing schema.sql:', err.message);
      db.close();
      process.exit(1);
    }

    // Example seed
    const stmt = db.prepare('INSERT INTO workouts (title, duration, metadata) VALUES (?, ?, ?)');
    stmt.run('Morning walk', 20, JSON.stringify({ intensity: 'low' }));
    stmt.run('Back strengthening', 15, JSON.stringify({ intensity: 'medium' }));
    stmt.finalize((err) => {
      if (err) console.error('Seed error:', err.message);
      else console.log('Initial seed done.');
      db.close();
    });
  });
});
