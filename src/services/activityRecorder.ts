// src/services/activityRecorder.ts
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
let motionLastSampleTs = 0;

// -------- Notifications (API + optional local notification) --------

// Set this in .env (Vite requires VITE_ prefix)
// Example:
// VITE_NOTIFICATION_API_URL=https://your-api.example.com/notify
const NOTIFICATION_API_URL: string | undefined = (import.meta as any)?.env
  ?.VITE_NOTIFICATION_API_URL;

type ApiNotification = {
  title: string;
  body: string;
  id?: string;
};

type NotificationApiResponse = {
  notifications?: ApiNotification[];
};

// Permission caching (avoid repeated prompts + avoid scheduling when denied)
let localNotifPermissionState: 'unknown' | 'granted' | 'denied' = 'unknown';

async function ensureLocalNotificationPermission(): Promise<boolean> {
  if (localNotifPermissionState === 'granted') return true;
  if (localNotifPermissionState === 'denied') return false;

  try {
    const mod = await import('@capacitor/local-notifications');
    const LocalNotifications = mod?.LocalNotifications;
    if (!LocalNotifications) {
      localNotifPermissionState = 'denied';
      return false;
    }

    const perm = await LocalNotifications.requestPermissions();
    const granted = perm?.display === 'granted';
    localNotifPermissionState = granted ? 'granted' : 'denied';
    return granted;
  } catch {
    // Web/dev without plugin or missing dependency
    localNotifPermissionState = 'denied';
    return false;
  }
}

async function showLocalNotifications(notifs: ApiNotification[]) {
  if (!notifs?.length) return;

  const granted = await ensureLocalNotificationPermission();
  if (!granted) {
    console.log('[notifications] (not granted) API wanted:', notifs);
    return;
  }

  try {
    const mod = await import('@capacitor/local-notifications');
    const LocalNotifications = mod?.LocalNotifications;
    if (!LocalNotifications) return;

    const now = Date.now();

    await LocalNotifications.schedule({
      notifications: notifs.map((n, idx) => ({
        id: Number(n.id ?? (now + idx)),
        title: n.title,
        body: n.body,
        schedule: { at: new Date(now + 500 + idx * 250) }, // liten stagger
      })),
    });
  } catch (e) {
    console.warn('[notifications] failed to schedule local notifications', e);
  }
}

async function callNotificationApi(
  payload: any
): Promise<NotificationApiResponse | null> {
  if (!NOTIFICATION_API_URL) return null;

  try {
    const res = await fetch(NOTIFICATION_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.warn('[notifications] API responded with non-OK:', res.status);
      return null;
    }

    const data = (await res.json().catch(() => null)) as
      | NotificationApiResponse
      | null;

    return data;
  } catch (e) {
    console.warn('[notifications] API call failed', e);
    return null;
  }
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
    const Pedometer = mod && (mod.CapacitorPedometer || mod.default || (mod as any));
    if (!Pedometer) return;

    if (typeof Pedometer.addListener === 'function') {
      pedometerSubscription = await Pedometer.addListener(
        'measurement',
        (data: any) => {
          if (data && typeof data.numberOfSteps === 'number') {
            stepsCounter = data.numberOfSteps;
          }
        }
      );
    } else {
      console.warn(
        '[activityRecorder] Pedometer plugin does not support addListener'
      );
    }
  } catch (e) {
    console.warn(
      '[activityRecorder] pedometer plugin not available (@capgo/capacitor-pedometer)',
      e
    );
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
      const DeviceMotion = mod && (mod.DeviceMotion || mod.default || (mod as any));
      if (!DeviceMotion) continue;

      if (typeof DeviceMotion.addListener === 'function') {
        motionSubscription = await DeviceMotion.addListener(
          'devicemotion',
          (ev: any) => {
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
                  Math.pow(a.x || 0, 2) +
                    Math.pow(a.y || 0, 2) +
                    Math.pow(a.z || 0, 2)
                );
              }

              gyroSamples.push(mag);
              if (gyroSamples.length > 600) {
                gyroSamples.splice(0, gyroSamples.length - 600);
              }
            } catch {
              // ignore per-sample errors
            }
          }
        );
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
                Math.pow(a.x || 0, 2) +
                  Math.pow(a.y || 0, 2) +
                  Math.pow(a.z || 0, 2)
              );
            }

            gyroSamples.push(mag);
            if (gyroSamples.length > 600) {
              gyroSamples.splice(0, gyroSamples.length - 600);
            }
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
      speedSamples.length
        ? speedSamples.reduce((a, b) => a + b, 0) / speedSamples.length
        : null;

    const gyroMovement =
      gyroSamples.length
        ? gyroSamples.reduce((a, b) => a + b, 0) / gyroSamples.length
        : null;

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

    // ---- Call notification API AFTER save ----
    const apiPayload = {
      event: 'activity_log_insert',
      timestamp: now.toISOString(),
      day_of_week: dayOfWeek,
      metrics: {
        avg_speed_kmh: avgSpeed,
        gyro_movement: gyroMovement,
        steps_delta: stepsDelta,
      },
      location: {
        latitude: lat,
        longitude: lon,
      },
    };

    const apiRes = await callNotificationApi(apiPayload);
    if (apiRes?.notifications?.length) {
      await showLocalNotifications(apiRes.notifications);
    }

    // reset samples
    speedSamples = [];
    gyroSamples = [];
    lastRecordedSteps = stepsCounter;
  } catch (e) {
    console.error('[activityRecorder] persistRecord error', e);
  }
}

export async function startActivityRecorder(opts?: {
  sampleIntervalMs?: number;
  recordIntervalMs?: number;
}) {
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
        const p = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          maximumAge: 0,
        });

        if (
          p &&
          p.coords &&
          typeof p.coords.speed === 'number' &&
          !isNaN(p.coords.speed)
        ) {
          speedSamples.push(p.coords.speed * 3.6); // m/s -> km/h
          if (speedSamples.length > 120) {
            speedSamples.splice(0, speedSamples.length - 120);
          }
        }
      } catch {
        // ignore per-sample errors
      }
    } catch (err) {
      console.warn('[activityRecorder] position sample failed', err);
    }
  }, sampleIntervalMs);

  // persistence schedule
  recordInterval = setInterval(() => {
    try {
      persistRecord().catch((err) =>
        console.error('[activityRecorder] persistRecord failed', err)
      );
    } catch (err) {
      console.error('[activityRecorder] persistRecord schedule failed', err);
    }
  }, recordIntervalMs);

  // initial quick persist
  setTimeout(() => {
    try {
      persistRecord().catch(() => {});
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
