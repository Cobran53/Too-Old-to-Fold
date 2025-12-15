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

// Try to read seed data from src/data/workouts.json (exported from YAML / source of truth)
const seedJsonPath = path.resolve(__dirname, '..', 'src', 'data', 'workouts.json');
let seedData = null;
if (fs.existsSync(seedJsonPath)) {
  try {
    seedData = JSON.parse(fs.readFileSync(seedJsonPath, 'utf8'));
  } catch (e) {
    console.error('Failed to parse workouts.json seed file:', e.message);
  }
} else {
  console.warn('No workouts.json seed file found at', seedJsonPath);
}

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

    // Seed from workouts.json if available
    if (seedData && Array.isArray(seedData.workouts) && seedData.workouts.length > 0) {
      const stmt = db.prepare('INSERT INTO workouts (title, duration, metadata) VALUES (?, ?, ?)');
      for (const w of seedData.workouts) {
        const title = w.name || w.title || 'Untitled';
        const duration = typeof w.duration_minutes === 'number' ? w.duration_minutes : (w.duration || 0);
        // Store remaining fields in metadata JSON for flexibility
        const metadata = {
          uid: w.id,
          length: w.length,
          link_to_page: w.link_to_page,
          link_to_image: w.link_to_image,
          location: w.location,
          category: w.category,
          description: w.description
        };
        stmt.run(title, duration, JSON.stringify(metadata));
      }
      stmt.finalize((err) => {
        if (err) console.error('Seed error:', err.message);
        else console.log('Initial seed done from workouts.json.');
        db.close();
      });
    } else {
      console.log('No seed data available; skipping initial seed.');
      db.close();
    }
  });
});
