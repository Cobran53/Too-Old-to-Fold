import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonGrid,
  IonRow,
  IonButton,
} from '@ionic/react';
import {
  settingsOutline,
} from 'ionicons/icons';

import './Dashboard.css';
import MiniWorkoutCard from '../components/MiniWorkoutCard';
import GoalCard from '../components/GoalCard';
import AppTabBar from '../components/AppTabBar';

const formatDate = (date: Date): string => {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wes', 'Thu', 'Fri', 'Sat'];
  const dayOfWeek = dayNames[date.getDay()];
  const dateNumber = date.getDate();
  return `${dayOfWeek} ${dateNumber}`;
};

const getDateKey = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const Dashboard: React.FC = () => {
  // vald dag (default: idag)
  const [selectedDateKey, setSelectedDateKey] = useState(getDateKey(new Date()));
  const [datesToDisplay, setDatesToDisplay] = useState<Date[]>([]);

  useEffect(() => {
    const today = new Date();
    const days: Date[] = [];

    // start: 3 dagar innan idag
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 3);

    // 11 dagar: 3 före, idag, 7 efter
    for (let i = 0; i < 11; i++) {
      const nextDay = new Date(startDate);
      nextDay.setDate(startDate.getDate() + i);
      days.push(nextDay);
    }

    setDatesToDisplay(days);
  }, []);

  const handleDateClick = (date: Date) => {
    const newSelectedKey = getDateKey(date);
    setSelectedDateKey(newSelectedKey);
    console.log(`Date selected: ${newSelectedKey}`);
  };

  return (
    <IonPage className="dashboard-page">
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonTitle slot="start" className="month-title">
            {new Date().toLocaleString('en', { month: 'long' })}{' '}
            {new Date().getFullYear()}
          </IonTitle>

          {/* KUGGHJUL → SETTINGS */}
          <IonButton
            slot="end"
            fill="clear"
            routerLink="/settings"
            aria-label="Open settings"
          >
            <IonIcon icon={settingsOutline} className="settings-icon" />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding dashboard-content">
        {/* Datumraden */}
        <section className="date-picker-section">
          <div className="date-picker">
            {datesToDisplay.map((date) => {
              const dayString = formatDate(date);
              const dateKey = getDateKey(date);
              const parts = dayString.split(' ');
              const isActive = dateKey === selectedDateKey;

              return (
                <div
                  key={dateKey}
                  className={`day-card ${isActive ? 'active' : 'inactive'}`}
                  onClick={() => handleDateClick(date)}
                >
                  {parts.map((part, i) => (
                    <span
                      key={i}
                      className={i === 1 ? 'date-number' : 'day-letter'}
                    >
                      {part}
                    </span>
                  ))}
                </div>
              );
            })}
          </div>
          <div className="date-dots">
            <span className="dot active"></span>
            <span className="dot"></span>
          </div>
        </section>

        {/* Today's Plan */}
        <section className="todays-plan">
          <h3 className="section-title">Today's Plan</h3>

          <MiniWorkoutCard
            title="Long Walk"
            time="10:00 AM"
            description="7 km walk in the sunny weather"
            imageSrc="https://picsum.photos/seed/walk/100/100"
            imageAlt="A sunny path"
          />
          <MiniWorkoutCard
            title="Leg Workout At Home"
            time="3:00 PM"
            description="Simple leg focused workout"
            imageSrc="https://picsum.photos/seed/yoga/100/100"
            imageAlt="A sunny path"
          />
        </section>

        {/* Weekly Goals */}
        <section className="weekly-goals">
          <h3 className="section-title">Wekly Goals</h3>

          <IonGrid className="goals-container">
            <IonRow>
              <GoalCard
                title="Strength"
                minText="mins left"
                minimumValue={55}
                completionPercentage={40}
              />

              <GoalCard
                title="Distance"
                minText="steps left"
                minimumValue={500}
                completionPercentage={80}
              />
            </IonRow>
          </IonGrid>
        </section>
      </IonContent>

      <AppTabBar selectedTab="home" />
    </IonPage>
  );
};

export default Dashboard;
