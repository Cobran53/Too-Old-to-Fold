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
  useIonRouter,
} from '@ionic/react';
import {
  settingsOutline,
} from 'ionicons/icons';

import './Dashboard.css';
import MiniWorkoutCard from '../components/MiniWorkoutCard';
import GoalCard from '../components/GoalCard';
import AppTabBar from '../components/AppTabBar';
import useWorkouts from '../services/useWorkouts';

const formatDate = (date: Date): string => {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
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
  const ionRouter = useIonRouter();

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

  const { workouts, isLoading } = useWorkouts({// No criteria for now
  });
  console.log('Filtered Workouts:', workouts);  
  

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
                  onClick={() => {
                        // 1. First, update the selected date (always)
                        handleDateClick(date); 
                        
                        // 2. Then, if the clicked date is the currently selected (active) one, navigate
                        if (isActive) {
                            ionRouter.push('/calendar');
                        }
                    }}
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
          <h3 className="section-title">
            {selectedDateKey === getDateKey(new Date())
              ? "Today's Plan"
              : (() => {
                  const date = new Date(selectedDateKey);
                  const month = date.toLocaleString('en', { month: 'short' });
                  const day = date.getDate();
                  const getOrdinal = (n: number) => {
                    if (n > 3 && n < 21) return 'th';
                    switch (n % 10) {
                      case 1: return 'st';
                      case 2: return 'nd';
                      case 3: return 'rd';
                      default: return 'th';
                    }
                  };
                  return `${month} ${day}${getOrdinal(day)} plans`;
                })()}
          </h3>

          <div>
            {isLoading ? (
                <p>Loading workouts...</p>
            ) : (
                [...workouts]
                  .sort(() => Math.random() - 0.5)
                  .slice(0, 2)
                  .map((workout) => (
                    <MiniWorkoutCard
                      key={workout.id}
                      title={workout.name}
                      time={workout.duration_minutes + " mins"}
                      description={workout.description}
                      imageSrc={workout.link_to_image || "https://picsum.photos/seed/workout/100/100"}
                      imageAlt={workout.name}
                    />
                  ))
            )}
          </div>
        </section>

        {/* Weekly Goals */}
        <section className="weekly-goals">
          <h3 className="section-title">Weekly Goals</h3>

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
