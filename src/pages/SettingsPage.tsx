import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonIcon,
  IonListHeader,
  IonText,
} from '@ionic/react';
import { chevronBackOutline } from 'ionicons/icons';

const SettingsPage: React.FC = () => {
  // --- simple state for demo purposes ---
  const [sedentaryFrequency, setSedentaryFrequency] = React.useState('30 min');
  const [workoutReminder, setWorkoutReminder] = React.useState('push-only');

  const [rainPref, setRainPref] = React.useState('dont-recommend');
  const [hailPref, setHailPref] = React.useState('hide-all');
  const [snowPref, setSnowPref] = React.useState('show-all');
  const [belowTempPref, setBelowTempPref] = React.useState('dont-recommend');

  const [minTemp, setMinTemp] = React.useState(5);

  const decreaseTemp = () => setMinTemp((prev) => Math.max(-20, prev - 1));
  const increaseTemp = () => setMinTemp((prev) => Math.min(30, prev + 1));

  const handleResetHidden = () => {
    // TODO: implement real logic later
    console.log('Reset all hidden workouts');
  };

  const handleDeleteAccount = () => {
    // TODO: implement real logic later
    console.log('Delete account');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          {/* Back button – Nolann kan koppla riktig navigation senare */}
          <IonButton slot="start" fill="clear">
            <IonIcon icon={chevronBackOutline} />
          </IonButton>
          <IonTitle>Account Settings</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonList lines="full">
          {/* ---- Notifications ---- */}
          <IonListHeader>
            <IonLabel>
              <strong>Notifications</strong>
            </IonLabel>
          </IonListHeader>

          <IonItem>
            <IonLabel>Frequency of sedentary warnings</IonLabel>
            <IonSelect
              interface="popover"
              value={sedentaryFrequency}
              onIonChange={(e) => setSedentaryFrequency(e.detail.value)}
            >
              <IonSelectOption value="15 min">15 min</IonSelectOption>
              <IonSelectOption value="30 min">30 min</IonSelectOption>
              <IonSelectOption value="60 min">60 min</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel>Workout reminders</IonLabel>
            <IonSelect
              interface="popover"
              value={workoutReminder}
              onIonChange={(e) => setWorkoutReminder(e.detail.value)}
            >
              <IonSelectOption value="push-only">Push only</IonSelectOption>
              <IonSelectOption value="none">No reminders</IonSelectOption>
            </IonSelect>
          </IonItem>

          {/* ---- Outside workout preferences ---- */}
          <IonListHeader>
            <IonLabel>
              <strong>Outside workout preferences</strong>
            </IonLabel>
          </IonListHeader>

          <IonItem>
            <IonLabel>During rain</IonLabel>
            <IonSelect
              interface="popover"
              value={rainPref}
              onIonChange={(e) => setRainPref(e.detail.value)}
            >
              <IonSelectOption value="dont-recommend">Do not recommend</IonSelectOption>
              <IonSelectOption value="show-all">Show all</IonSelectOption>
              <IonSelectOption value="hide-all">Hide all</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel>During hail</IonLabel>
            <IonSelect
              interface="popover"
              value={hailPref}
              onIonChange={(e) => setHailPref(e.detail.value)}
            >
              <IonSelectOption value="hide-all">Hide all</IonSelectOption>
              <IonSelectOption value="dont-recommend">Do not recommend</IonSelectOption>
              <IonSelectOption value="show-all">Show all</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel>During snow</IonLabel>
            <IonSelect
              interface="popover"
              value={snowPref}
              onIonChange={(e) => setSnowPref(e.detail.value)}
            >
              <IonSelectOption value="show-all">Show all</IonSelectOption>
              <IonSelectOption value="dont-recommend">Do not recommend</IonSelectOption>
              <IonSelectOption value="hide-all">Hide all</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel>Below min. temperature</IonLabel>
            <IonSelect
              interface="popover"
              value={belowTempPref}
              onIonChange={(e) => setBelowTempPref(e.detail.value)}
            >
              <IonSelectOption value="dont-recommend">Do not recommend</IonSelectOption>
              <IonSelectOption value="show-all">Show all</IonSelectOption>
              <IonSelectOption value="hide-all">Hide all</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel>Min. temperature</IonLabel>
            <IonButton slot="end" fill="outline" size="small" onClick={decreaseTemp}>
              −
            </IonButton>
            <IonText slot="end" style={{ padding: '0 8px' }}>
              {minTemp}°C
            </IonText>
            <IonButton slot="end" fill="outline" size="small" onClick={increaseTemp}>
              +
            </IonButton>
          </IonItem>

          {/* ---- Account ---- */}
          <IonListHeader>
            <IonLabel>
              <strong>Account</strong>
            </IonLabel>
          </IonListHeader>

          <IonItem>
            <IonLabel>Data preferences</IonLabel>
            <IonText slot="end" color="medium">
              Survey data
            </IonText>
          </IonItem>

          <IonItem button detail={false} onClick={handleResetHidden}>
            <IonLabel color="danger">Reset all hidden workouts</IonLabel>
          </IonItem>

          <IonItem button detail={false} onClick={handleDeleteAccount}>
            <IonLabel color="danger">Delete account</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default SettingsPage;
