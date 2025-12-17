// Minimal activity recorder — happy path only
// Uses only: @capacitor/geolocation, @capgo/capacitor-pedometer, @capacitor/motion

import { open as dbOpen, run as dbRun, close as dbClose } from './sqlite';
let positionInterval: any = null;
let recordInterval: any = null;
let motionListener: any = null;
let pedometerListener: any = null;
let isRunning = false;

let speedSamples: number[] = [];
let gyroSamples: number[] = [];
let stepsCounter = 0;
let lastRecordedSteps = 0;
let lastCoords = { latitude: null as number | null, longitude: null as number | null };

async function persistRecord() {
  const timestamp = new Date().toISOString();
  const avgSpeed = speedSamples.length ? speedSamples.reduce((a, b) => a + b, 0) / speedSamples.length : null;
  const gyroMovement = gyroSamples.length ? gyroSamples.reduce((a, b) => a + b, 0) / gyroSamples.length : null;
  const stepsDelta = stepsCounter - lastRecordedSteps;
  const now = new Date();
  
  console.log('[activityRecorder] sample', { avgSpeed, gyroMovement, stepsDelta, lat: lastCoords.latitude, lon: lastCoords.longitude, timestamp: now.toISOString() });
  // reset
  speedSamples = [];
  gyroSamples = [];
  lastRecordedSteps = stepsCounter;
  
  // persist into activity_log
  try {
    const avg = (avgSpeed === null || isNaN(avgSpeed as any)) ? null : Number(avgSpeed);
    const gyro = (gyroMovement === null || isNaN(gyroMovement as any)) ? null : Number(gyroMovement);
    const steps = Number.isFinite(stepsDelta) ? Math.max(0, Math.floor(stepsDelta)) : null;
    const lat = (lastCoords.latitude === null || lastCoords.latitude === undefined) ? null : Number(lastCoords.latitude);
    const lon = (lastCoords.longitude === null || lastCoords.longitude === undefined) ? null : Number(lastCoords.longitude);

    // Open DB, insert, then close to avoid keeping connection open
    try {
      await dbOpen('appdb');
      const insertSql = `INSERT INTO activity_log (avg_speed, gyro_movement, steps, latitude, longitude, timestamp) VALUES (${avg === null ? 'NULL' : avg}, ${gyro === null ? 'NULL' : gyro}, ${steps === null ? 'NULL' : steps}, ${lat === null ? 'NULL' : lat}, ${lon === null ? 'NULL' : lon}, '${timestamp}');`;
      await dbRun(insertSql);
    } finally {
      try { await dbClose(); } catch (e) {}
    }
  } catch (e) {
    console.error('[activityRecorder] failed to persist record to DB', e);
  }
}

export async function startActivityRecorder(opts?: { sampleIntervalMs?: number; recordIntervalMs?: number }) {
  if (isRunning) return;
  isRunning = true;

  const sampleIntervalMs = opts?.sampleIntervalMs ?? 5000;
  const recordIntervalMs = opts?.recordIntervalMs ?? 60 * 1000;

  // Happy-path: load the three plugins and attach listeners
  const geoMod: any = await import('@capacitor/geolocation');
  const { Geolocation } = geoMod;
  // Request location permission up front
  try {
    const permRes: any = await Geolocation.requestPermissions();
    // permRes may be { location: 'granted'|'denied' } or similar
    const locStatus = permRes && (permRes.location || permRes.locationAlways || permRes.locationWhenInUse);
    if (locStatus && String(locStatus).toLowerCase() === 'denied') {
      console.warn('[activityRecorder] location permission denied — aborting start');
      isRunning = false;
      return;
    }
  } catch (e) {
    // If requesting permissions failed, log and continue — the plugin may prompt later
    console.warn('[activityRecorder] Geolocation.requestPermissions failed', e);
  }
  const pedMod: any = await import('@capgo/capacitor-pedometer');
  const Pedometer = pedMod && (pedMod.CapacitorPedometer || pedMod.default || pedMod);
  const motionMod: any = await import('@capacitor/motion');
  const Motion = motionMod && (motionMod.Motion || motionMod.default || motionMod);

  // On Android we should also request activity recognition permission for pedometer
  try {
    const capCore: any = await import('@capacitor/core');
    const platform = capCore && capCore.Capacitor && capCore.Capacitor.getPlatform && capCore.Capacitor.getPlatform();
    if (platform === 'android') {
      const Permissions: any = capCore && capCore.Permissions;
      if (Permissions && typeof Permissions.request === 'function') {
        try {
          // best-effort request for activity recognition
          await Permissions.request({ name: 'android.permission.ACTIVITY_RECOGNITION' });
        } catch (e) {
          // ignore failures — plugin may still work or app can prompt later
          console.warn('[activityRecorder] activity recognition permission request failed', e);
        }
      }
    }
  } catch (e) {
    // ignore import errors
  }

  // pedometer (happy path uses addListener 'measurement')
  if (Pedometer && typeof Pedometer.addListener === 'function') {
    pedometerListener = await Pedometer.addListener('measurement', (data: any) => {
      if (data && typeof data.numberOfSteps === 'number') stepsCounter = data.numberOfSteps;
    });
  }

  // motion (happy path uses 'accel')
  if (Motion && typeof Motion.addListener === 'function') {
    motionListener = await Motion.addListener('accel', (ev: any) => {
      const r = ev.rotationRate || ev.rotation || ev;
      const a = ev.acceleration || ev.accelerationIncludingGravity || ev;
      let mag = 0;
      if (r) mag = Math.sqrt(Math.pow(r.alpha || 0, 2) + Math.pow(r.beta || 0, 2) + Math.pow(r.gamma || 0, 2));
      else if (a) mag = Math.sqrt(Math.pow(a.x || 0, 2) + Math.pow(a.y || 0, 2) + Math.pow(a.z || 0, 2));
      gyroSamples.push(mag);
      if (gyroSamples.length > 600) gyroSamples.splice(0, gyroSamples.length - 600);
    });
  }

  // periodic position/speed sampling
  positionInterval = setInterval(async () => {
    const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, maximumAge: 0 });
    if (pos && pos.coords) {
      lastCoords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
      if (typeof pos.coords.speed === 'number' && !isNaN(pos.coords.speed)) {
        // convert m/s to km/h
        speedSamples.push(pos.coords.speed * 3.6);
        if (speedSamples.length > 120) speedSamples.splice(0, speedSamples.length - 120);
      }
    }
  }, sampleIntervalMs);


  // schedule persistence
  recordInterval = setInterval(() => {
    void persistRecord();
  }, recordIntervalMs);

  // initial quick persist
  setTimeout(() => { void persistRecord(); }, Math.min(5000, recordIntervalMs));
}

export function stopActivityRecorder() {
  if (!isRunning) return;
  isRunning = false;
  if (positionInterval) { clearInterval(positionInterval); positionInterval = null; }
  if (recordInterval) { clearInterval(recordInterval); recordInterval = null; }
  try { if (motionListener && typeof motionListener.remove === 'function') motionListener.remove(); else if (motionListener && typeof motionListener.stop === 'function') motionListener.stop(); } catch (e) {}
  try { if (pedometerListener && typeof pedometerListener.remove === 'function') pedometerListener.remove(); else if (pedometerListener && typeof pedometerListener.stop === 'function') pedometerListener.stop(); } catch (e) {}
}

export function isActivityRecorderRunning() { return isRunning; }
