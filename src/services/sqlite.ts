
// Minimal Android-only Capacitor SQLite connector
// Exports three functions: open(name), run(sql, values?), close()
// Very small: no web fallback, no JSON export, intended for frequent open/close.

import { CapacitorSQLite } from '@capacitor-community/sqlite';

let _openDbName: string | null = null;

export async function open(name: string): Promise<void> {
	if (_openDbName === name) return;
	// open the native sqlite database (Android)
	try {
		// Ensure a native connection object exists. createConnection may
		// return an error if the connection already exists — ignore that.
		try {
			await (CapacitorSQLite as any).createConnection({ database: name });
		} catch (e: any) {
			const msg = e && (e.message || String(e));
			if (!msg || !String(msg).toLowerCase().includes('already exists')) {
				throw e;
			}
			// otherwise continue — connection was already present
		}

		await (CapacitorSQLite as any).open({ database: name });
		_openDbName = name;
	} catch (err) {
		_openDbName = null;
		throw err;
	}
}

export async function run(sql: string, values?: any[]): Promise<any> {
	if (!_openDbName) throw new Error('Database is not open');
	const s = String(sql).trim();
	try {
		if (s.toLowerCase().startsWith('select')) {
			// query returns rows
			return await (CapacitorSQLite as any).query({
				database: _openDbName,
				statement: sql,
				values: values || [],
			});
		}

		// execute statements (one or many separated by `;`)
		return await (CapacitorSQLite as any).execute({
			database: _openDbName,
			statements: sql,
		});
	} catch (err) {
		throw err;
	}
}

export async function close(): Promise<void> {
	if (!_openDbName) return;
	try {
		// Close the DB for the current open name
		await (CapacitorSQLite as any).close({ database: _openDbName });
		// Also attempt to remove the native connection object if supported
		try {
			await (CapacitorSQLite as any).closeConnection({ database: _openDbName });
		} catch (e) {
			// ignore if not supported or already closed
		}
	} finally {
		_openDbName = null;
	}
}

