import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonButton,
  IonIcon,
} from '@ionic/react';
import {
  arrowBackOutline,
  chevronDownOutline,
  removeOutline,
  addOutline,
} from 'ionicons/icons';

import './SettingsPage.css';

type SettingField =
  | 'sedentary'
  | 'reminders'
  | 'rain'
  | 'hail'
  | 'snow'
  | 'belowTempPref'
  | 'dataPref';

const SettingsPage: React.FC = () => {
  // Värden som visas i raderna
  const [sedentaryFreq, setSedentaryFreq] = useState('30 min');
  const [reminderMode, setReminderMode] = useState('Push only');
  const [rainPreference, setRainPreference] = useState('Do not recommend');
  const [hailPreference, setHailPreference] = useState('Hide all');
  const [snowPreference, setSnowPreference] = useState('Show all');
  const [belowTempPref, setBelowTempPref] = useState('Do not recommend');
  const [dataPreference, setDataPreference] = useState('Survey data');
  const [minTemp, setMinTemp] = useState(5); // grader C

  // vilken rad som har “dropdown” öppen
  const [activeField, setActiveField] = useState<SettingField | null>(null);

  const getFieldOptions = (field: SettingField): string[] => {
    switch (field) {
      case 'sedentary':
        return ['15 min', '30 min', '60 min', '120 min'];
      case 'reminders':
        return ['Push only', 'Email only', 'Push + Email', 'Off'];
      case 'rain':
        return ['Do not recommend', 'Recommend indoors only', 'Allow all'];
      case 'hail':
        return ['Hide all', 'Show indoor only'];
      case 'snow':
        return ['Show all', 'Show indoor only', 'Do not recommend'];
      case 'belowTempPref':
        return ['Do not recommend', 'Recommend indoors only', 'Allow all'];
      case 'dataPref':
        return ['Survey data', 'Phone sensors', 'Survey + Sensors'];
      default:
        return [];
    }
  };

  const handleOptionSelect = (field: SettingField, value: string) => {
    switch (field) {
      case 'sedentary':
        setSedentaryFreq(value);
        break;
      case 'reminders':
        setReminderMode(value);
        break;
      case 'rain':
        setRainPreference(value);
        break;
      case 'hail':
        setHailPreference(value);
        break;
      case 'snow':
        setSnowPreference(value);
        break;
      case 'belowTempPref':
        setBelowTempPref(value);
        break;
      case 'dataPref':
        setDataPreference(value);
        break;
    }
    setActiveField(null);
  };

  const decreaseTemp = () => {
    setMinTemp((t) => Math.max(-10, t - 1));
  };

  const increaseTemp = () => {
    setMinTemp((t) => Math.min(30, t + 1));
  };

  const renderDropdown = (field: SettingField) => {
    if (activeField !== field) return null;

    return (
      <div className="settings-inline-options">
        {getFieldOptions(field).map((option) => (
          <button
            key={option}
            className="settings-inline-option-button"
            onClick={() => handleOptionSelect(field, option)}
          >
            {option}
          </button>
        ))}
      </div>
    );
  };

  return (
    <IonPage className="settings-page">
      {/* Svart topp med rund bottencurve + back-knapp */}
      <IonHeader className="ion-no-border settings-header">
        <IonToolbar className="settings-toolbar">
          <div className="settings-header-inner">
            <IonButton
              className="settings-back-button"
              fill="solid"
              routerLink="/dashboard"
            >
              <IonIcon icon={arrowBackOutline} />
            </IonButton>

            <h1 className="settings-header-title">Account Settings</h1>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="settings-content">
        {/* --- Notifications --- */}
        <section className="settings-section settings-section-first">
          <h2 className="settings-section-title">Notifications</h2>

          {/* Frequency of sedentarity warnings */}
          <div className="settings-row">
            <div className="settings-row-text">
              <span className="settings-row-label">
                Frequency of sedentarity warnings
              </span>
            </div>
            <button
              className="settings-row-value"
              onClick={() =>
                setActiveField((prev) =>
                  prev === 'sedentary' ? null : 'sedentary'
                )
              }
            >
              <span>{sedentaryFreq}</span>
              <IonIcon icon={chevronDownOutline} />
            </button>
          </div>
          {renderDropdown('sedentary')}

          {/* Workout reminders */}
          <div className="settings-row">
            <div className="settings-row-text">
              <span className="settings-row-label">Workout reminders</span>
            </div>
            <button
              className="settings-row-value"
              onClick={() =>
                setActiveField((prev) =>
                  prev === 'reminders' ? null : 'reminders'
                )
              }
            >
              <span>{reminderMode}</span>
              <IonIcon icon={chevronDownOutline} />
            </button>
          </div>
          {renderDropdown('reminders')}
        </section>

        {/* --- Outside workout preferences --- */}
        <section className="settings-section">
          <h2 className="settings-section-title">
            Outside workout preferences
          </h2>

          <div className="settings-row">
            <div className="settings-row-text">
              <span className="settings-row-label">During rain</span>
            </div>
            <button
              className="settings-row-value"
              onClick={() =>
                setActiveField((prev) => (prev === 'rain' ? null : 'rain'))
              }
            >
              <span>{rainPreference}</span>
              <IonIcon icon={chevronDownOutline} />
            </button>
          </div>
          {renderDropdown('rain')}

          <div className="settings-row">
            <div className="settings-row-text">
              <span className="settings-row-label">During hail</span>
            </div>
            <button
              className="settings-row-value"
              onClick={() =>
                setActiveField((prev) => (prev === 'hail' ? null : 'hail'))
              }
            >
              <span>{hailPreference}</span>
              <IonIcon icon={chevronDownOutline} />
            </button>
          </div>
          {renderDropdown('hail')}

          <div className="settings-row">
            <div className="settings-row-text">
              <span className="settings-row-label">During snow</span>
            </div>
            <button
              className="settings-row-value"
              onClick={() =>
                setActiveField((prev) => (prev === 'snow' ? null : 'snow'))
              }
            >
              <span>{snowPreference}</span>
              <IonIcon icon={chevronDownOutline} />
            </button>
          </div>
          {renderDropdown('snow')}

          <div className="settings-row">
            <div className="settings-row-text">
              <span className="settings-row-label">Below min. temperature</span>
            </div>
            <button
              className="settings-row-value"
              onClick={() =>
                setActiveField((prev) =>
                  prev === 'belowTempPref' ? null : 'belowTempPref'
                )
              }
            >
              <span>{belowTempPref}</span>
              <IonIcon icon={chevronDownOutline} />
            </button>
          </div>
          {renderDropdown('belowTempPref')}

          <div className="settings-row settings-row-min-temp">
            <div className="settings-row-text">
              <span className="settings-row-label">
                Min. temperature: {minTemp}°C
              </span>
            </div>
            <div className="settings-row-counter">
              <button
                className="settings-counter-button"
                onClick={decreaseTemp}
              >
                <IonIcon icon={removeOutline} />
              </button>
              <button
                className="settings-counter-button"
                onClick={increaseTemp}
              >
                <IonIcon icon={addOutline} />
              </button>
            </div>
          </div>
        </section>

        {/* --- Account --- */}
        <section className="settings-section">
          <h2 className="settings-section-title">Account</h2>

          <div className="settings-row">
            <div className="settings-row-text">
              <span className="settings-row-label">Data preferences</span>
            </div>
            <button
              className="settings-row-value"
              onClick={() =>
                setActiveField((prev) =>
                  prev === 'dataPref' ? null : 'dataPref'
                )
              }
            >
              <span>{dataPreference}</span>
              <IonIcon icon={chevronDownOutline} />
            </button>
          </div>
          {renderDropdown('dataPref')}

          <button className="settings-row-link settings-row-link-danger">
            Reset all hidden workouts
          </button>

          <button className="settings-row-link settings-row-link-danger">
            Delete account
          </button>
        </section>
      </IonContent>
    </IonPage>
  );
};

export default SettingsPage;
