// Helper Node-only pour ouvrir la base SQLite (utilisé côté serveur / scripts)
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

const dbPath = path.resolve(__dirname, '..', '..', 'db', 'database.sqlite');

export async function openDb() {
  // sqlite wrapper from 'sqlite' + sqlite3 driver
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
  return db;
}

export default openDb;
