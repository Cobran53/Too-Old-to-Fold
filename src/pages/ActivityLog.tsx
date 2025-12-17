import React, { useEffect, useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonList, IonItem, IonLabel, IonSpinner } from '@ionic/react';
import { open as dbOpen, run as dbRun, close as dbClose } from '../services/sqlite';

type ActivityRow = {
  id: number;
  avg_speed: number | null;
  gyro_movement: number | null;
  steps: number | null;
  latitude: number | null;
  longitude: number | null;
  timestamp: string | null;
};

const ActivityLog: React.FC = () => {
  const [rows, setRows] = useState<ActivityRow[] | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      await dbOpen('appdb');
      const res: any = await dbRun(
        `SELECT id, avg_speed, gyro_movement, steps, latitude, longitude, timestamp
         FROM activity_log
         ORDER BY timestamp DESC
         LIMIT 100;`
      );
      const raw: any[] = (res && (res.values || res.results || res.rows))
        ? (res.values || res.results || res.rows)
        : (Array.isArray(res) ? res : []);

      const toNum = (v: any): number | null => {
        if (v === null || v === undefined) return null;
        if (typeof v === 'number') return v;
        const n = Number(v);
        return isNaN(n) ? null : n;
      };

      const mapped: ActivityRow[] = raw.map((r: any) => ({
        id: r.id ?? (Array.isArray(r) ? r[0] : Math.random()),
        avg_speed: toNum(r.avg_speed ?? (Array.isArray(r) ? r[1] : undefined)),
        gyro_movement: toNum(r.gyro_movement ?? (Array.isArray(r) ? r[2] : undefined)),
        steps: toNum(r.steps ?? (Array.isArray(r) ? r[3] : undefined)),
        latitude: toNum(r.latitude ?? (Array.isArray(r) ? r[4] : undefined)),
        longitude: toNum(r.longitude ?? (Array.isArray(r) ? r[5] : undefined)),
        timestamp: (r.timestamp ?? (Array.isArray(r) ? r[6] : null)) || null,
      }));

      setRows(mapped);
    } catch (e) {
      console.error('Failed to load activity_log', e);
      setRows([]);
    } finally {
      try { await dbClose(); } catch {}
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Activity Log</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <IonButton onClick={load}>Refresh</IonButton>
          <IonButton onClick={() => setRows([])} color="medium">Clear View</IonButton>
        </div>

        {loading && <IonSpinner />}

        {!loading && rows && rows.length === 0 && <div>No records</div>}

        {!loading && rows && rows.length > 0 && (
          <IonList>
            {rows.map(r => (
              <IonItem key={r.id} lines="full">
                <IonLabel>
                  <h3>{r.timestamp}</h3>
                  <p>Speed: {r.avg_speed ?? '-'} km/h • Steps: {r.steps ?? '-'} • Gyro: {r.gyro_movement ?? '-'} </p>
                  <p>Lat/Lon: {r.latitude ?? '-'} / {r.longitude ?? '-'}</p>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ActivityLog;
