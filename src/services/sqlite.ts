import { CapacitorSQLite } from '@capacitor-community/sqlite';

let _openDbName: string | null = null;

export async function open(name: string): Promise<void> {
	if (_openDbName === name) return;
	// open the native sqlite database (Android)
	try {
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
			return await (CapacitorSQLite as any).query({
				database: _openDbName,
				statement: sql,
				values: values || [],
			});
		}

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
		await (CapacitorSQLite as any).close({ database: _openDbName });
		try {
			await (CapacitorSQLite as any).closeConnection({ database: _openDbName });
		} catch (e) {
			// ignore if not supported or already closed
		}
	} finally {
		_openDbName = null;
	}
}

