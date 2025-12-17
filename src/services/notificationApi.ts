// src/services/notificationApi.ts
import { sendNotification } from './notify';

export type ActivityPayload = {
  avg_speed: number | null;
  gyro_movement: number | null;
  steps: number;
  latitude: number | null;
  longitude: number | null;
  timestamp: string;     // ISO string
  day_of_week: string;
};

// Enkel anti-spam: max 1 notis per 5 minuter
let lastNotificationTs = 0;

function getNotifyUrl(): string | null {
  // 1) Ny env (direkt endpoint, t.ex. http://127.0.0.1:3000/notify)
  const direct = (import.meta as any).env?.VITE_NOTIFICATION_API_URL;
  if (direct) return String(direct);

  // 2) Bakåtkomp: bas-url (t.ex. http://127.0.0.1:3000) -> /notify
  const baseUrl = (import.meta as any).env?.VITE_API_BASE_URL;
  if (baseUrl) return `${String(baseUrl).replace(/\/$/, '')}/notify`;

  return null;
}

export async function maybeNotifyFromApi(payload: ActivityPayload) {
  const now = Date.now();
  if (now - lastNotificationTs < 5 * 60 * 1000) return;

  const url = getNotifyUrl();
  if (!url) {
    console.warn('[notificationApi] Missing VITE_NOTIFICATION_API_URL (or VITE_API_BASE_URL) in .env');
    return;
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.warn('[notificationApi] API responded with', res.status);
      return;
    }

    const data = await res.json().catch(() => null);

    // ✅ NYTT FORMAT (som din Swagger visar):
    // { "notifications": [ { "title": "...", "body": "..." } ] }
    if (data?.notifications && Array.isArray(data.notifications) && data.notifications.length) {
      lastNotificationTs = now;
      for (const n of data.notifications) {
        await sendNotification(n.title ?? 'Reminder', n.body ?? '');
      }
      return;
    }

    // ✅ GAMMALT FORMAT (om ni hade det innan):
    // { "shouldNotify": true, "title": "...", "message": "..." }
    if (data?.shouldNotify) {
      lastNotificationTs = now;
      await sendNotification(
        data.title ?? 'Reminder',
        data.message ?? 'You have a new recommendation.'
      );
    }
  } catch (e) {
    console.warn('[notificationApi] API call failed', e);
  }
}

// En enkel test-funktion du kan koppla till en knapp
export async function testNotifyButton() {
  const d = new Date();
  await maybeNotifyFromApi({
    avg_speed: null,
    gyro_movement: null,
    steps: 0,
    latitude: null,
    longitude: null,
    timestamp: d.toISOString(),
    day_of_week: d.toLocaleString(undefined, { weekday: 'long' }),
  });
}
