import React from 'react';
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

const SettingsPage: React.FC = () => {
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
        <section className="settings-section">
          <h2 className="settings-section-title">Notifications</h2>

          <div className="settings-row">
            <div className="settings-row-text">
              <span className="settings-row-label">
                Frequency of sedentarity warnings
              </span>
            </div>
            <button className="settings-row-value">
              <span>30 min</span>
              <IonIcon icon={chevronDownOutline} />
            </button>
          </div>

          <div className="settings-row">
            <div className="settings-row-text">
              <span className="settings-row-label">Workout reminders</span>
            </div>
            <button className="settings-row-value">
              <span>Push only</span>
              <IonIcon icon={chevronDownOutline} />
            </button>
          </div>
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
            <button className="settings-row-value">
              <span>Do not recommend</span>
              <IonIcon icon={chevronDownOutline} />
            </button>
          </div>

          <div className="settings-row">
            <div className="settings-row-text">
              <span className="settings-row-label">During hail</span>
            </div>
            <button className="settings-row-value">
              <span>Hide all</span>
              <IonIcon icon={chevronDownOutline} />
            </button>
          </div>

          <div className="settings-row">
            <div className="settings-row-text">
              <span className="settings-row-label">During snow</span>
            </div>
            <button className="settings-row-value">
              <span>Show all</span>
              <IonIcon icon={chevronDownOutline} />
            </button>
          </div>

          <div className="settings-row">
            <div className="settings-row-text">
              <span className="settings-row-label">Below min. temperature</span>
            </div>
            <button className="settings-row-value">
              <span>Do not recommend</span>
              <IonIcon icon={chevronDownOutline} />
            </button>
          </div>

          <div className="settings-row settings-row-min-temp">
            <div className="settings-row-text">
              <span className="settings-row-label">Min. temperature: 5°C</span>
            </div>
            <div className="settings-row-counter">
              <button className="settings-counter-button">
                <IonIcon icon={removeOutline} />
              </button>
              <button className="settings-counter-button">
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
            <button className="settings-row-value">
              <span>Survey data</span>
              <IonIcon icon={chevronDownOutline} />
            </button>
          </div>

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
