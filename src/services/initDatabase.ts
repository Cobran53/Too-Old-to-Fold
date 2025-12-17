import { openDb } from './sqlite';
import schemaSql from '../../db/schema.sql?raw';
import seedData from '../data/workouts.json';

export async function initDatabase() {
  const db = await openDb();
  if (!db) return;

  // Nettoie les commentaires (/* ... */ et -- ...) puis découpe en statements SQL
  const cleaned = schemaSql
    .replace(/\/\*[\s\S]*?\*\//g, '') // supprime les block comments
    .replace(/--.*$/gm, ''); // supprime les commentaires ligne

  const statements = cleaned
    .split(';')
    .map(s => s.trim())
    .filter(s => s);

  for (const stmt of statements) {
    try {
      await db.run(stmt);
    } catch (e) {
      // Ignore "table already exists" et continue
      if (!String(e).includes('already exists')) {
        console.error('Erreur SQL:', stmt, e);
      }
    }
  }

  // Vérifie s'il y a déjà des données
  let workouts = [];
  try {
    workouts = await db.all('SELECT COUNT(*) as count FROM workouts', []);
  } catch (e) {
    console.error('Error while doing SELECT COUNT on workouts:', e);
    await db.close();
    return;
  }
  if (workouts[0]?.count > 0) {
    await db.close();
    return;
  }

  // Insère les données de seed
  if (seedData && Array.isArray(seedData.workouts)) {
    for (const wRaw of seedData.workouts) {
      const w: any = wRaw;
      const title = w.name || w.title || 'Untitled';
      const duration = typeof w.duration_minutes === 'number' ? w.duration_minutes : (w.duration || 0);
      const metadata = {
        uid: w.id,
        length: w.length,
        link_to_page: w.link_to_page,
        link_to_image: w.link_to_image,
        location: w.location,
        category: w.category,
        description: w.description
      };
      await db.run(
        'INSERT INTO workouts (title, duration, metadata) VALUES (?, ?, ?)',
        [title, duration, JSON.stringify(metadata)]
      );
    }
  }
  await db.close();
}
