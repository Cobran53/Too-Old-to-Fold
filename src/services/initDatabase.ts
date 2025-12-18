import workoutsJson from '../data/workouts.json';
import { open as dbOpen, run as dbRun, close as dbClose } from './sqlite';

function escapeSqlString(s: string): string {
	return s.replace(/'/g, "''");
}

export async function seedWorkouts(items: any[]): Promise<void> {
	if (!items || items.length === 0) return;

	const stmts = items.map((w: any) => {
		const title = escapeSqlString(w.name || w.title || 'Untitled');
		const duration = typeof w.duration_minutes === 'number' ? w.duration_minutes : (w.duration || 0);
		const metadataObj = {
			uid: w.id,
			length: w.length,
			link_to_page: w.link_to_page,
			link_to_image: w.link_to_image,
			location: w.location,
			category: w.category,
			description: w.description,
			duration_minutes: w.duration_minutes
		};
		const metadata = escapeSqlString(JSON.stringify(metadataObj));
		return `INSERT INTO workouts (title, duration, metadata) VALUES ('${title}', ${Number(duration)}, '${metadata}');`;
	}).join('\n');

	await dbRun(stmts);
}

export async function initDatabase(): Promise<void> {
	const DB = 'appdb';
	try {
		await dbOpen(DB);

		const createSql = `CREATE TABLE IF NOT EXISTS workouts (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			title TEXT NOT NULL,
			duration INTEGER DEFAULT 0,
			metadata TEXT,
			created_at DATETIME DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
		);`;
		await dbRun(createSql);


		const createDayWorkoutsSql = `CREATE TABLE IF NOT EXISTS dayWorkouts (
			date DATE NOT NULL,
			workout_id INTEGER NOT NULL,
			PRIMARY KEY (date, workout_id),
			FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE
		);`;
		await dbRun(createDayWorkoutsSql);

		const createActivityLogSql = `CREATE TABLE IF NOT EXISTS activity_log (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			avg_speed REAL,
			gyro_movement REAL,
			steps INTEGER,
			latitude REAL,
			longitude REAL,
			timestamp TEXT,
			day_of_week TEXT,
			created_at DATETIME DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
		);`;
		await dbRun(createActivityLogSql);

		const items = (workoutsJson && (workoutsJson as any).workouts) ? (workoutsJson as any).workouts : [];
		
		var noWorkouts = false;
		if (items.length === 0) {
			noWorkouts = true;
		}
		
		const existingWorkouts = await dbRun('SELECT COUNT(*) as count FROM workouts;');
		if (existingWorkouts[0]?.count > 0) {
			noWorkouts = true;
		}
		if (!noWorkouts) {
			await seedWorkouts(items).catch(async (err) => {
				console.error('Error seeding workouts:', err);
			});
		}

		var noDayWorkouts = false;
		const existingDayWorkouts = await dbRun('SELECT COUNT(*) as count FROM dayWorkouts;');
		if (existingDayWorkouts[0]?.count > 0) {
			noDayWorkouts = true;
		}

		if (!noDayWorkouts) {
			const today = new Date();
			for (let offset = -7; offset <= 30; offset++) {
				const date = new Date(today);
				date.setDate(today.getDate() + offset);
				const dateStr = date.toISOString().slice(0, 10); // YYYY-MM-DD
				const assignSql = `INSERT OR IGNORE INTO dayWorkouts (date, workout_id)
					SELECT '${dateStr}' AS date, id FROM workouts
					ORDER BY RANDOM() LIMIT 2;`;
				await dbRun(assignSql);
			}
		}

		await dbClose();

	} catch (err) {
		try { await dbClose(); } catch (e) {}
		throw err;
	}
}

export default initDatabase;
