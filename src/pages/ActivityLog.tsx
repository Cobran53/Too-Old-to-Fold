import React, { useEffect, useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonList, IonItem, IonLabel, IonSpinner } from '@ionic/react';
// SQLite disabled — ActivityLog will show no records until DB is restored

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
      console.log('[ActivityLog] load skipped: sqlite disabled');
      setRows([]);
    } catch (e) {
      console.error('Failed to load activity_log', e);
      setRows([]);
    } finally {
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
