// src/services/notify.ts

export async function sendNotification(title: string, body: string) {
  // --- Browser fallback ---
  if (typeof window !== 'undefined' && 'Notification' in window) {
    try {
      if (Notification.permission === 'granted') {
        new Notification(title, { body });
        return;
      }
    } catch {
      // ignore
    }
  }

  // --- Native (Capacitor) ---
  try {
    const core = await import('@capacitor/core');
    const { Capacitor } = core;

    if (!Capacitor?.isNativePlatform?.()) return;

    const mod = await import('@capacitor/local-notifications');
    const { LocalNotifications } = mod;

    const id = Math.floor(Math.random() * 1_000_000);

    await LocalNotifications.schedule({
      notifications: [
        {
          id,
          title,
          body,
          schedule: { at: new Date(Date.now() + 250) }, // liten delay
        },
      ],
    });
  } catch (e) {
    console.warn('[notify] native notification failed or plugin missing', e);
  }
}
