import { openDb } from './sqlite';

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

async function getCurrentPositionAndroid(): Promise<Coord> {
  try {
    const mod = await import('@capacitor/geolocation');
    const { Geolocation } = mod;
    const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, maximumAge: 0 });
    return { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
  } catch (e) {
    console.error('[activityRecorder] Geolocation.getCurrentPosition failed', e);
    return { latitude: null, longitude: null };
    }
}

async function initPedometerAndroid() {
  try {
    const mod = await import('@capgo/capacitor-pedometer');
    const Pedometer = mod && (mod.CapacitorPedometer || mod.default || mod);
    if (!Pedometer) return;

    // Support multiple plugin APIs: addListener or startUpdates
    if (typeof Pedometer.addListener === 'function') {
      // Capacitor-style listener
      pedometerSubscription = await Pedometer.addListener('measurement', (data: any) => {
        if (data && typeof data.numberOfSteps === 'number') stepsCounter = data.numberOfSteps;
      });
    } else {
      console.warn('[activityRecorder] Pedometer plugin does not support the "addListener" method');
    }
  } catch (e) {
    console.warn('[activityRecorder] pedometer plugin not available (@capgo/capacitor-pedometer)', e);
  }
}

async function initMotionAndroid() {
  // Try several possible device-motion plugin names and attach a listener
  const tryPlugins = ['@capacitor/device-motion', '@capacitor-community/device-motion', '@ionic-native/device-motion'];
  for (const name of tryPlugins) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const mod = await import(name as any);
      const DeviceMotion = mod && (mod.DeviceMotion || mod.default || mod);
      if (!DeviceMotion) continue;

      // Try addListener API
      if (typeof DeviceMotion.addListener === 'function') {
        motionSubscription = await DeviceMotion.addListener('devicemotion', (ev: any) => {
          try {
            const r = ev.rotationRate || ev.rotation || ev;
            const a = ev.acceleration || ev.accelerationIncludingGravity || ev;
            if (r) {
              const mag = Math.sqrt(Math.pow(r.alpha || 0, 2) + Math.pow(r.beta || 0, 2) + Math.pow(r.gamma || 0, 2));
              gyroSamples.push(mag);
            } else if (a) {
              const mag = Math.sqrt(Math.pow(a.x || 0, 2) + Math.pow(a.y || 0, 2) + Math.pow(a.z || 0, 2));
              gyroSamples.push(mag);
            }
          } catch (err) {
            // ignore per-sample errors
          }
        });
        return;
      }

      // Try start/subscribe style
      if (typeof DeviceMotion.watch === 'function') {
        motionSubscription = DeviceMotion.watch((ev: any) => {
          try {
            const r = ev.rotationRate || ev.rotation || ev;
            const a = ev.acceleration || ev.accelerationIncludingGravity || ev;
            if (r) {
              const mag = Math.sqrt(Math.pow(r.alpha || 0, 2) + Math.pow(r.beta || 0, 2) + Math.pow(r.gamma || 0, 2));
              gyroSamples.push(mag);
            } else if (a) {
              const mag = Math.sqrt(Math.pow(a.x || 0, 2) + Math.pow(a.y || 0, 2) + Math.pow(a.z || 0, 2));
              gyroSamples.push(mag);
            }
          } catch (err) {}
        });
        return;
      }
    } catch (e) {
      // try next plugin name
    }
  }
  console.warn('[activityRecorder] no device-motion plugin found (Android)');
}

async function persistRecord() {
  try {
    const avgSpeed = speedSamples.length ? speedSamples.reduce((a, b) => a + b, 0) / speedSamples.length : null;
    const gyroMovement = gyroSamples.length ? gyroSamples.reduce((a, b) => a + b, 0) / gyroSamples.length : null;
    const stepsDelta = stepsCounter - lastRecordedSteps;
    const lat = lastCoords.latitude;
    const lon = lastCoords.longitude;
    const now = new Date();
    const dayOfWeek = now.toLocaleString(undefined, { weekday: 'long' });

    const db = await openDb();
    if (!db) return;

    await db.run(
      'INSERT INTO activity_log (avg_speed, gyro_movement, steps, latitude, longitude, timestamp, day_of_week) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [avgSpeed, gyroMovement, stepsDelta, lat, lon, now.toISOString(), dayOfWeek]
    );
    if (typeof db.close === 'function') await db.close();

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

  // Initialize Android-specific plugins (Geolocation, pedometer, device-motion)
  await initPedometerAndroid();
  await initMotionAndroid();
    try {
      const mod = await import('@capacitor/motion');
      const Motion = mod && (mod.Motion || mod.default || mod);
      if (!Motion) {
        console.warn('[activityRecorder] @capacitor/motion module loaded but no export found');
        return;
      }

      if (typeof Motion.addListener === 'function') {
        try {
          motionSubscription = await Motion.addListener('accel', (ev: any) => {
            try {
              const r = ev.rotationRate || ev.rotation || ev;
              const a = ev.acceleration || ev.accelerationIncludingGravity || ev;
              if (r) {
                const mag = Math.sqrt(Math.pow(r.alpha || 0, 2) + Math.pow(r.beta || 0, 2) + Math.pow(r.gamma || 0, 2));
                gyroSamples.push(mag);
              } else if (a) {
                const mag = Math.sqrt(Math.pow(a.x || 0, 2) + Math.pow(a.y || 0, 2) + Math.pow(a.z || 0, 2));
                gyroSamples.push(mag);
              }
            } catch (err) {
              // ignore
            }
          });

          await Motion.addListener('orientation', (ev: any) => {
            try {
              const r = ev.rotationRate || ev.rotation || ev;
              const a = ev.acceleration || ev.accelerationIncludingGravity || ev;
              if (r) {
                const mag = Math.sqrt(Math.pow(r.alpha || 0, 2) + Math.pow(r.beta || 0, 2) + Math.pow(r.gamma || 0, 2));
                gyroSamples.push(mag);
              } else if (a) {
                const mag = Math.sqrt(Math.pow(a.x || 0, 2) + Math.pow(a.y || 0, 2) + Math.pow(a.z || 0, 2));
                gyroSamples.push(mag);
              }
            } catch (err) {
              // ignore
            }
          });
          return;
        } catch (err) {
          // handle errors
        }
      }
    } catch (e) {
      console.warn('[activityRecorder] no @capacitor/motion plugin available', e);
    }
  // start periodic sampling of position/speed
  positionInterval = setInterval(async () => {
    try {
      const pos = await getCurrentPositionAndroid();
      if (pos.latitude !== null && pos.longitude !== null) lastCoords = pos;

      // try to sample speed from Geolocation coords (m/s -> km/h)
      try {
        const mod = await import('@capacitor/geolocation');
        const { Geolocation } = mod;
        const p = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, maximumAge: 0 });
        if (p && p.coords && typeof p.coords.speed === 'number' && !isNaN(p.coords.speed)) {
          speedSamples.push(p.coords.speed * 3.6);
        }
      } catch (err) {
        // ignore per-sample errors
      }
    } catch (err) {
      console.warn('[activityRecorder] position sample failed', err);
    }
  }, sampleIntervalMs);

  // schedule persistence every recordIntervalMs
  recordInterval = setInterval(async () => {
    try {
      await persistRecord();
    } catch (err) {
      console.error('[activityRecorder] persistRecord failed', err);
    }
  }, recordIntervalMs);

  // initial quick persist after a short delay to create a first row
  setTimeout(() => {
    persistRecord().catch(() => {});
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
  } catch (e) {}

  try {
    if (recordInterval) {
      clearInterval(recordInterval);
      recordInterval = null;
    }
  } catch (e) {}

  try {
    if (motionSubscription && typeof motionSubscription.remove === 'function') {
      motionSubscription.remove();
    } else if (motionSubscription && typeof motionSubscription.stop === 'function') {
      motionSubscription.stop();
    }
  } catch (e) {}

  try {
    if (pedometerSubscription && typeof pedometerSubscription.remove === 'function') {
      pedometerSubscription.remove();
    } else if (pedometerSubscription && typeof pedometerSubscription.stop === 'function') {
      pedometerSubscription.stop();
    }
  } catch (e) {}
}
