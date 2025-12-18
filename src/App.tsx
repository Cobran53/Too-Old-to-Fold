import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, IonTabs, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import Navigation from './pages/Navigation';
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import TrainingListPage from './pages/TrainingListPage';
import Progress from './pages/Progress';
import SettingsPage from './pages/SettingsPage';
import Calendar from './pages/Calendar';
import ActivityLog from './pages/ActivityLog';
import React, { useEffect, useState } from 'react';
import { initDatabase } from './services/initDatabase';
import { startActivityRecorder, stopActivityRecorder } from './services/activityRecorder';

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
  const [dbReady, setDbReady] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await initDatabase();
        console.log('[App] initDatabase succeeded');
      } catch (e) {
        console.error('[App] initDatabase failed', e);
      }

      if (cancelled) return;

      try {
        await startActivityRecorder();
        console.log('[App] startActivityRecorder succeeded');
      } catch (e) {
        console.error('[App] startActivityRecorder failed', e);
      }

      setDbReady(true);
    })();

    return () => {
      cancelled = true;
      stopActivityRecorder();
    };
  }, []);

  return (
    <IonApp>
      {dbReady ? (
        <IonReactRouter>
          <IonTabs>
            <IonRouterOutlet>
            <Route exact path="/navigation">
              <Navigation />
            </Route>
            <Route exact path="/welcome">
              <Welcome />
            </Route>
            <Route exact path="/">
              <Redirect to="/welcome" />
            </Route>
            <Route exact path="/dashboard">
              <Dashboard />
            </Route>
            <Route exact path="/training-list">
              <TrainingListPage />
            </Route>
            <Route exact path="/progress">
              <Progress />
            </Route>
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
      ) : (
        <div style={{padding:20}}>Loading application...</div>
      )}
    </IonApp>
  );
};

export default App;
