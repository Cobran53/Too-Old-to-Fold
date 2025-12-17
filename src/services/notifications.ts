// src/services/notifications.ts
// En liten wrapper så att appen INTE kraschar i webben (ionic serve),
// men kan skicka riktiga notiser på mobil (Capacitor).

type NotifyInput = {
  title: string;
  body: string;
  id?: number;
};

let permissionAsked = false;

export async function ensureNotificationPermission(): Promise<boolean> {
  // Kör bara på enheter (inte web) -> annars returnera false utan att krascha
  try {
    const mod = await import('@capacitor/local-notifications');
    const { LocalNotifications } = mod;

    // Be om permission bara en gång per app-start
    if (!permissionAsked) {
      permissionAsked = true;
      const perm = await LocalNotifications.checkPermissions();
      if (perm.display !== 'granted') {
        const req = await LocalNotifications.requestPermissions();
        return req.display === 'granted';
      }
    }

    const perm2 = await LocalNotifications.checkPermissions();
    return perm2.display === 'granted';
  } catch {
    // Web / plugin saknas -> krascha inte
    return false;
  }
}

export async function notifyNow(input: NotifyInput): Promise<void> {
  const ok = await ensureNotificationPermission();

  // Om vi är i webben: gör inget (eller logga)
  if (!ok) {
    console.log('[notifications] (web fallback)', input.title, '-', input.body);
    return;
  }

  const mod = await import('@capacitor/local-notifications');
  const { LocalNotifications } = mod;

  const id = input.id ?? Math.floor(Math.random() * 1_000_000);

  await LocalNotifications.schedule({
    notifications: [
      {
        id,
        title: input.title,
        body: input.body,
        schedule: { at: new Date(Date.now() + 100) }, // “nu”
      },
    ],
  });
}
