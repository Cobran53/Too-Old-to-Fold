// Helper Node-only pour ouvrir la base SQLite (utilisé côté serveur / scripts)

// Détection dynamique de la plateforme
async function detectPlatform() {
  if (typeof window === 'undefined') return 'node';
  try {
    const cap = await import('@capacitor/core');
    if (cap.Capacitor && typeof cap.Capacitor.getPlatform === 'function') {
      return cap.Capacitor.getPlatform();
    }
  } catch (e) {}
  return 'web';
}

// Node.js: sqlite3
async function openDbNode() {
  const sqlite3 = (await import('sqlite3')).default;
  const { open } = await import('sqlite');
  const path = await import('path');
  const dbPath = path.resolve(__dirname, '..', '..', 'db', 'database.sqlite');
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
  return db;
}

// Capacitor natif: plugin SQLite
async function openDbCapacitor() {
  const mod = await import('@capacitor-community/sqlite');
  const { CapacitorSQLite, SQLiteConnection } = mod;
  const sqliteConn = new SQLiteConnection(CapacitorSQLite);
  const dbName = 'appdb';
  await sqliteConn.createConnection(dbName, false, 'no-encryption', 1);
  const db = await sqliteConn.open(dbName);
  // On retourne un objet qui expose une API compatible (all, run, etc.)
  return {
    all: async (query, params) => {
      const res = await db.query(query, params);
      return (res && (res.values || res.rows || res.results)) || [];
    },
    run: async (query, params) => db.run(query, params),
    close: async () => sqliteConn.closeConnection(dbName),
  };
}

// Web fallback: lève une erreur explicite (ce cas ne doit pas arriver)
async function openDbWeb() {
  throw new Error('openDb: Should not be called on web platform.');
}

/**
 * Ouvre la base de données selon la plateforme (Node, Capacitor natif, Web)
 */
export async function openDb() {
  const platform = await detectPlatform();
  if (platform === 'node') return openDbNode();
  if (platform !== 'web') return openDbCapacitor();
  return openDbWeb();
}

export default openDb;
