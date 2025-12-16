import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
} from '@ionic/react';

import {
  calendarOutline,
  walkOutline,
  scaleOutline,
  ellipsisVerticalOutline,
} from 'ionicons/icons';

import './Progress.css';
import AppTabBar from '../components/AppTabBar';

type RangeView = 'weekly' | 'monthly';

type Activity = {
  id: number;
  title: string;
  subtitle: string;
  icon: 'walk' | 'balance';
};

const initialActivities: Activity[] = [
  {
    id: 1,
    title: '30 Minute Walk',
    subtitle: 'About 20 minutes ago',
    icon: 'walk',
  },
  {
    id: 2,
    title: 'Balance Circuit 2',
    subtitle: 'Yesterday',
    icon: 'balance',
  },
  {
    id: 3,
    title: 'Morning Walk',
    subtitle: '2 days ago',
    icon: 'walk',
  },
  {
    id: 4,
    title: 'Balance Circuit 1',
    subtitle: 'Last week',
    icon: 'balance',
  },
];

const Progress: React.FC = () => {
  // Bara visning – inga knappar för att ändra värden
  const targetWorkouts = 1;
  const completedWorkouts = 0;

  const targetMinutes = 60;
  const minutesWalked = 30;

  // Weekly / Monthly
  const [rangeView, setRangeView] = useState<RangeView>('weekly');

  const weeklyData = [20, 40, 30, 55, 25, 15, 35]; // Sun–Sat
  const monthlyData = [10, 25, 40, 30, 50, 35, 20];

  const data = rangeView === 'weekly' ? weeklyData : monthlyData;
  const maxValue = Math.max(...data);

  const toggleRangeView = () => {
    setRangeView(prev => (prev === 'weekly' ? 'monthly' : 'weekly'));
  };

  // Latest activities
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [openActivityId, setOpenActivityId] = useState<number | null>(null);

  const visibleActivities = showAllActivities ? activities : activities.slice(0, 2);

  const handleToggleOptions = (activityId: number) => {
    setOpenActivityId(prev => (prev === activityId ? null : activityId));
  };

  const handleRemoveActivity = (activityId: number) => {
    setActivities(prev => prev.filter(a => a.id !== activityId));
    setOpenActivityId(null);
  };

  const toggleShowMore = () => setShowAllActivities(prev => !prev);

  return (
    <IonPage className="progress-page">
      {/* HEADER */}
      <IonHeader className="ion-no-border">
        <IonToolbar className="progress-toolbar">
          <IonTitle className="progress-title">Progress Tracker</IonTitle>
          <IonButtons slot="end">
            <IonButton
              fill="clear"
              aria-label="Open calendar"
              routerLink="/calendar"
              routerDirection="forward"
            >
              <IonIcon icon={calendarOutline} className="calendar-icon" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      {/* CONTENT */}
      <IonContent fullscreen className="progress-content">
        <div className="progress-inner">
          {/* --- 1. Todays Target Progress (bara status) --- */}
          <section className="card target-card">
            <div className="target-header">
              <span className="target-title">Todays Target Progress</span>
            </div>

            <div className="target-values-row">
              <div className="target-column">
                <p className="target-main-value">
                  {completedWorkouts}/{targetWorkouts}
                </p>
                <p className="target-label">Workouts completed</p>
              </div>
              <div className="target-column">
                <p className="target-main-value">
                  {minutesWalked}/{targetMinutes}
                </p>
                <p className="target-label">Minutes walked</p>
              </div>
            </div>
          </section>

          {/* --- 2. Activity Progress chart --- */}
          <section className="section-block">
            <div className="section-header">
              <h2>Activity Progress</h2>

              <button
                type="button"
                className="range-toggle"
                onClick={toggleRangeView}
              >
                {rangeView === 'weekly' ? 'Weekly' : 'Monthly'}
              </button>
            </div>

            <div className="card chart-card">
              <div className="chart-bars">
                {data.map((value, index) => {
                  const heightPercent = (value / maxValue) * 100;
                  const isBeige = index % 2 === 1; // varannan beige/blå

                  return (
                    <div className="chart-column" key={index}>
                      <div
                        className={
                          'chart-bar ' +
                          (isBeige ? 'chart-bar-light' : 'chart-bar-dark')
                        }
                        style={{ height: `${heightPercent}%` }}
                      />
                      <span className="chart-day-label">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* --- 3. Latest Activity --- */}
          <section className="section-block">
            <div className="section-header">
              <h2>Latest Activity</h2>
              <button
                className="see-more-button"
                type="button"
                onClick={toggleShowMore}
              >
                {showAllActivities ? 'See less' : 'See more'}
              </button>
            </div>

            {visibleActivities.map(activity => (
              <div key={activity.id} className="activity-wrapper">
                <div className="activity-card">
                  <div
                    className={
                      'activity-icon-box ' +
                      (activity.icon === 'balance' ? 'activity-icon-balance' : '')
                    }
                  >
                    <IonIcon
                      icon={activity.icon === 'walk' ? walkOutline : scaleOutline}
                      className={
                        activity.icon === 'balance' ? 'icon-light' : 'icon-dark'
                      }
                    />
                  </div>

                  <div className="activity-text">
                    <p className="activity-title">{activity.title}</p>
                    <p className="activity-subtitle">{activity.subtitle}</p>
                  </div>

                  <IonButton
                    fill="clear"
                    size="small"
                    className="activity-more-btn"
                    onClick={() => handleToggleOptions(activity.id)}
                  >
                    <IonIcon icon={ellipsisVerticalOutline} />
                  </IonButton>
                </div>

                {openActivityId === activity.id && (
                  <div className="activity-options">
                    <button
                      type="button"
                      className="activity-option-btn destructive"
                      onClick={() => handleRemoveActivity(activity.id)}
                    >
                      Remove from history
                    </button>
                    <button
                      type="button"
                      className="activity-option-btn"
                      onClick={() => setOpenActivityId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </section>
        </div>
      </IonContent>

      {/* Bottennavigation */}
      <AppTabBar selectedTab="progress" />
    </IonPage>
  );
};

export default Progress;
