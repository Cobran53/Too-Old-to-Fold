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
  let db: any;
  // Try to create the connection only when it does not already exist.
  try {
    // Newer plugin versions provide isConnection — use it when available.
    if (typeof sqliteConn.isConnection === 'function') {
      const exists = await sqliteConn.isConnection(dbName, false);
      if (!exists) {
        await sqliteConn.createConnection(dbName, false, 'no-encryption', 1, false);
      }
    } else {
      // Fallback: attempt to create and ignore "already exists" error.
      try {
        await sqliteConn.createConnection(dbName, false, 'no-encryption', 1, false);
      } catch (e: any) {
        if (!e || !String(e).includes('already exists')) {
          throw e;
        }
      }
    }

    db = await sqliteConn.retrieveConnection(dbName, false);
    if (typeof db.open === 'function') {
      await db.open();
    }
  } catch (e) {
    console.warn('[openDbCapacitor] connection error:', e);
    throw e;
  }
  // Log pour debug Android
  console.log('[openDbCapacitor] db:', db);
  console.log('[openDbCapacitor] sqliteConn:', sqliteConn);
  // On retourne un objet qui expose une API compatible (all, run, etc.)
  return {
    all: async (query: string, params: any[] = []) => {
      const resAny: any = await db.query(query, params);
      console.log('[openDbCapacitor] all() result:', resAny);
      return resAny && (resAny.values || resAny.rows || resAny.results) || [];
    },
    run: async (query: string, params: any[] = []) => db.run(query, params),
    close: async () => sqliteConn.closeConnection(dbName, false),
  };
}

// Web fallback: renvoie null (ou on pourrait charger un JSON statique)
async function openDbWeb() {
  // Ici, on pourrait charger un JSON ou retourner null
  
  return null;
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
