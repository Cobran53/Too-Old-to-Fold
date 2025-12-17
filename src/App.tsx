import React, { useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, IonTabs, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import { ensureNotificationPermission } from './services/notifications';
import { initDatabase } from './services/initDatabase';
import { startActivityRecorder, stopActivityRecorder } from './services/activityRecorder';

import Navigation from './pages/Navigation';
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import TrainingListPage from './pages/TrainingListPage';
import Progress from './pages/Progress';
import SettingsPage from './pages/SettingsPage';
import Calendar from './pages/Calendar';
import ActivityLog from './pages/ActivityLog';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Dark mode */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import './App.css';

setupIonicReact();

const App: React.FC = () => {
  useEffect(() => {
    let cancelled = false;

    (async () => {
      // ✅ 1) Be om notis-permission vid appstart (web: oftast no-op, mobil: prompt)
      try {
        await ensureNotificationPermission();
      } catch (e) {
        console.error('ensureNotificationPermission failed', e);
      }

      // ✅ 2) Init DB
      try {
        await initDatabase();
      } catch (e) {
        console.error('initDatabase failed', e);
      }
      try {
  await ensureNotificationPermission();
} catch (e) {
  console.warn('ensureNotificationPermission failed', e);
}

      if (cancelled) return;

      // ✅ 3) Start recorder
      try {
        await startActivityRecorder();
      } catch (e) {
        console.error('startActivityRecorder failed', e);
      }
    })();

    return () => {
      cancelled = true;
      try {
        stopActivityRecorder();
      } catch (e) {
        console.error('stopActivityRecorder failed', e);
      }
    };
  }, []);

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            {/* Start / navigation flow */}
            <Route exact path="/navigation">
              <Navigation />
            </Route>

            <Route exact path="/welcome">
              <Welcome />
            </Route>

            <Route exact path="/">
              <Redirect to="/welcome" />
            </Route>

            {/* Huvudsidor */}
            <Route exact path="/dashboard">
              <Dashboard />
            </Route>

            <Route exact path="/training-list">
              <TrainingListPage />
            </Route>

            <Route exact path="/progress">
              <Progress />
            </Route>

            {/* Settings & Calendar */}
            <Route exact path="/settings">
              <SettingsPage />
            </Route>

            <Route exact path="/calendar">
              <Calendar />
            </Route>

            <Route exact path="/activity-log">
              <ActivityLog />
            </Route>
          </IonRouterOutlet>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
