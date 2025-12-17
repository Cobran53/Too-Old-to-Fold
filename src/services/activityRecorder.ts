// src/services/activityRecorder.ts
import * as sqlite from './sqlite';
import { maybeNotifyFromApi } from './notificationApi';

type Coord = { latitude: number | null; longitude: number | null };

let positionInterval: any = null;
let recordInterval: any = null;
let motionSubscription: any = null;
let pedometerSubscription: any = null;
let isRunning = false;

let speedSamples: number[] = [];
let gyroSamples: number[] = [];
let stepsCounter = 0;
let lastRecordedSteps = 0;
let lastCoords: Coord = { latitude: null, longitude: null };
let motionLastSampleTs = 0;

// ---------- DB helpers (stödjer både openDb() och open/run/close) ----------
function sqlLiteral(v: any): string {
  if (v === null || v === undefined) return 'NULL';
  if (typeof v === 'number') return Number.isFinite(v) ? String(v) : 'NULL';
  if (typeof v === 'boolean') return v ? '1' : '0';
  // string/date
  const s = String(v).replace(/'/g, "''");
  return `'${s}'`;
}

// Bygger en "värde-SQL" om din sqlite.run inte tar params
function buildInsertSql(params: any[]) {
  return `
INSERT INTO activity_log (avg_speed, gyro_movement, steps, latitude, longitude, timestamp, day_of_week)
VALUES (${params.map(sqlLiteral).join(', ')});
`.trim();
}

async function dbInsertActivity(params: any[]) {
  // Variant A: sqlite.openDb() => db.run(sql, params)
  const openDbFn = (sqlite as any).openDb;
  if (typeof openDbFn === 'function') {
    const db = await openDbFn();
    if (!db) return;

    try {
      await db.run(
        'INSERT INTO activity_log (avg_speed, gyro_movement, steps, latitude, longitude, timestamp, day_of_week) VALUES (?, ?, ?, ?, ?, ?, ?)',
        params
      );
    } finally {
      try {
        if (typeof db.close === 'function') await db.close();
      } catch {}
    }
    return;
  }

  // Variant B: sqlite.open(name) + sqlite.run(sql[, params]) + sqlite.close()
  const openFn = (sqlite as any).open;
  const runFn = (sqlite as any).run;
  const closeFn = (sqlite as any).close;

  if (typeof openFn === 'function' && typeof runFn === 'function') {
    // Försök öppna (om din wrapper kräver db-namn)
    try {
      // Om open() inte tar argument går det bra ändå
      await openFn('appdb');
    } catch {
      try { await openFn(); } catch {}
    }

    try {
      // Om run kan ta (sql, params) -> använd det, annars kör SQL med inbäddade värden
      if (runFn.length >= 2) {
        await runFn(
          'INSERT INTO activity_log (avg_speed, gyro_movement, steps, latitude, longitude, timestamp, day_of_week) VALUES (?, ?, ?, ?, ?, ?, ?)',
          params
        );
      } else {
        await runFn(buildInsertSql(params));
      }
    } finally {
      try {
        if (typeof closeFn === 'function') await closeFn();
      } catch {}
    }
    return;
  }

  console.warn('[activityRecorder] No compatible sqlite API found (openDb or open/run/close).');
}

// -------- Sensors / helpers --------

async function getCurrentPositionAndroid(): Promise<Coord> {
  try {
    const mod = await import('@capacitor/geolocation');
    const { Geolocation } = mod;
    const pos = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      maximumAge: 0,
    });
    return { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
  } catch (e) {
    console.error('[activityRecorder] Geolocation.getCurrentPosition failed', e);
    return { latitude: null, longitude: null };
  }
}

async function initPedometerAndroid() {
  try {
    const mod = await import('@capgo/capacitor-pedometer');
    const Pedometer =
      mod && ((mod as any).CapacitorPedometer || (mod as any).default || (mod as any));
    if (!Pedometer) return;

    if (typeof Pedometer.addListener === 'function') {
      pedometerSubscription = await Pedometer.addListener('measurement', (data: any) => {
        if (data && typeof data.numberOfSteps === 'number') {
          stepsCounter = data.numberOfSteps;
        }
      });
    } else {
      console.warn('[activityRecorder] Pedometer plugin does not support addListener');
    }
  } catch (e) {
    console.warn('[activityRecorder] pedometer plugin not available (@capgo/capacitor-pedometer)', e);
  }
}

async function initMotionAndroid() {
  const tryPlugins = [
    '@capacitor/motion',
    '@capacitor/device-motion',
    '@capacitor-community/device-motion',
    '@ionic-native/device-motion',
  ];

  for (const name of tryPlugins) {
    try {
      const mod = await import(name as any);
      const DeviceMotion =
        mod && ((mod as any).DeviceMotion || (mod as any).default || (mod as any));
      if (!DeviceMotion) continue;

      if (typeof DeviceMotion.addListener === 'function') {
        motionSubscription = await DeviceMotion.addListener('devicemotion', (ev: any) => {
          try {
            const now = Date.now();
            if (now - motionLastSampleTs < 200) return;
            motionLastSampleTs = now;

            const r = ev.rotationRate || ev.rotation || ev;
            const a = ev.acceleration || ev.accelerationIncludingGravity || ev;

            let mag = 0;
            if (r) {
              mag = Math.sqrt(
                Math.pow(r.alpha || 0, 2) +
                  Math.pow(r.beta || 0, 2) +
                  Math.pow(r.gamma || 0, 2)
              );
            } else if (a) {
              mag = Math.sqrt(
                Math.pow(a.x || 0, 2) + Math.pow(a.y || 0, 2) + Math.pow(a.z || 0, 2)
              );
            }

            gyroSamples.push(mag);
            if (gyroSamples.length > 600) gyroSamples.splice(0, gyroSamples.length - 600);
          } catch {}
        });
        return;
      }

      if (typeof DeviceMotion.watch === 'function') {
        motionSubscription = DeviceMotion.watch((ev: any) => {
          try {
            const now = Date.now();
            if (now - motionLastSampleTs < 200) return;
            motionLastSampleTs = now;

            const r = ev.rotationRate || ev.rotation || ev;
            const a = ev.acceleration || ev.accelerationIncludingGravity || ev;

            let mag = 0;
            if (r) {
              mag = Math.sqrt(
                Math.pow(r.alpha || 0, 2) +
                  Math.pow(r.beta || 0, 2) +
                  Math.pow(r.gamma || 0, 2)
              );
            } else if (a) {
              mag = Math.sqrt(
                Math.pow(a.x || 0, 2) + Math.pow(a.y || 0, 2) + Math.pow(a.z || 0, 2)
              );
            }

            gyroSamples.push(mag);
            if (gyroSamples.length > 600) gyroSamples.splice(0, gyroSamples.length - 600);
          } catch {}
        });
        return;
      }
    } catch {
      // try next plugin
    }
  }

  console.warn('[activityRecorder] no motion plugin found (Android)');
}

async function persistRecord() {
  try {
    const avgSpeed =
      speedSamples.length ? speedSamples.reduce((a, b) => a + b, 0) / speedSamples.length : null;

    const gyroMovement =
      gyroSamples.length ? gyroSamples.reduce((a, b) => a + b, 0) / gyroSamples.length : null;

    const stepsDeltaRaw = stepsCounter - lastRecordedSteps;
    const stepsDelta = Number.isFinite(stepsDeltaRaw) ? Math.max(0, Math.floor(stepsDeltaRaw)) : 0;

    const lat = lastCoords.latitude;
    const lon = lastCoords.longitude;

    const now = new Date();
    const dayOfWeek = now.toLocaleString(undefined, { weekday: 'long' });

    await dbInsertActivity([avgSpeed, gyroMovement, stepsDelta, lat, lon, now.toISOString(), dayOfWeek]);

    // Trigger notification logic via API (if configured)
    try {
      await maybeNotifyFromApi({
        avg_speed: avgSpeed,
        gyro_movement: gyroMovement,
        steps: stepsDelta,
        latitude: lat,
        longitude: lon,
        timestamp: now.toISOString(),
        day_of_week: dayOfWeek,
      });
    } catch (e) {
      console.warn('[activityRecorder] maybeNotifyFromApi failed', e);
    }

    // reset samples
    speedSamples = [];
    gyroSamples = [];
    lastRecordedSteps = stepsCounter;
  } catch (e) {
    console.error('[activityRecorder] persistRecord error', e);
  }
}

export async function startActivityRecorder(opts?: { sampleIntervalMs?: number; recordIntervalMs?: number }) {
  if (isRunning) return;
  isRunning = true;

  const sampleIntervalMs = opts?.sampleIntervalMs ?? 5000; // sample sensors every 5s
  const recordIntervalMs = opts?.recordIntervalMs ?? 15 * 60 * 1000; // default 15 minutes

  await initPedometerAndroid();

  // Only init motion if not already running
  if (!motionSubscription) {
    await initMotionAndroid();
  }

  // periodic sampling (position/speed)
  positionInterval = setInterval(async () => {
    try {
      const pos = await getCurrentPositionAndroid();
      if (pos.latitude !== null && pos.longitude !== null) lastCoords = pos;

      try {
        const mod = await import('@capacitor/geolocation');
        const { Geolocation } = mod;
        const p = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, maximumAge: 0 });

        if (p?.coords && typeof p.coords.speed === 'number' && !isNaN(p.coords.speed)) {
          speedSamples.push(p.coords.speed * 3.6); // m/s -> km/h
          if (speedSamples.length > 120) speedSamples.splice(0, speedSamples.length - 120);
        }
      } catch {}
    } catch (err) {
      console.warn('[activityRecorder] position sample failed', err);
    }
  }, sampleIntervalMs);

  // persistence schedule
  recordInterval = setInterval(() => {
    try {
      void persistRecord();
    } catch (err) {
      console.error('[activityRecorder] persistRecord schedule failed', err);
    }
  }, recordIntervalMs);

  // initial quick persist
  setTimeout(() => {
    try {
      void persistRecord();
    } catch {}
  }, Math.min(5000, recordIntervalMs));
}

export function stopActivityRecorder() {
  if (!isRunning) return;
  isRunning = false;

  try {
    if (positionInterval) {
      clearInterval(positionInterval);
      positionInterval = null;
    }
  } catch {}

  try {
    if (recordInterval) {
      clearInterval(recordInterval);
      recordInterval = null;
    }
  } catch {}

  try {
    if (motionSubscription && typeof motionSubscription.remove === 'function') {
      motionSubscription.remove();
    } else if (motionSubscription && typeof motionSubscription.stop === 'function') {
      motionSubscription.stop();
    }
    motionSubscription = null;
  } catch {}

  try {
    if (pedometerSubscription && typeof pedometerSubscription.remove === 'function') {
      pedometerSubscription.remove();
    } else if (pedometerSubscription && typeof pedometerSubscription.stop === 'function') {
      pedometerSubscription.stop();
    }
    pedometerSubscription = null;
  } catch {}
}

export function isActivityRecorderRunning() {
  return isRunning;
}
