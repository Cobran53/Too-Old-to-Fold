import React, { useMemo, useState } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
} from '@ionic/react';
import { arrowBackOutline, flameOutline } from 'ionicons/icons';

import './Calendar.css';

// -------- Hjälpfunktioner för streaks --------

const calculateLongestStreak = (days: number[]): number => {
  if (days.length === 0) return 0;
  const sorted = [...new Set(days)].sort((a, b) => a - b);

  let longest = 1;
  let current = 1;

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === sorted[i - 1] + 1) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }
  return longest;
};

const getCurrentStreakDays = (days: number[]): number[] => {
  if (days.length === 0) return [];
  const sorted = [...new Set(days)].sort((a, b) => a - b);
  const set = new Set(sorted);
  const lastDay = sorted[sorted.length - 1];

  const streak: number[] = [];
  let d = lastDay;
  while (set.has(d)) {
    streak.unshift(d);
    d--;
  }
  return streak;
};

// -------- Data: färdiga completed-days + aktiviteter --------

// Samma “fyllda” dagar som i din design: 6, 8–11
const COMPLETED_DAYS: number[] = [6, 8, 9, 10, 11];

type DayActivity = {
  title: string;
  subtitle: string;
};

const activitiesByDay: Record<number, DayActivity[]> = {
  6: [
    { title: 'Evening Walk', subtitle: '6 km · 55 min' },
  ],
  8: [
    { title: 'Balance Circuit 1', subtitle: '20 min · Balance' },
  ],
  9: [
    { title: 'Brisk Morning Walk', subtitle: '7 km · 60 min' },
  ],
  10: [
    { title: 'Safe Steps', subtitle: '20 min · At home' },
  ],
  11: [
    { title: 'Beginner Yoga', subtitle: '25 min · Strength' },
  ],
  // andra dagar: inga aktiviteter → tom lista
};

const Calendar: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<number>(12); // understruken dag

  const daysInMonth = 31;
  const allDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const currentStreakDays = useMemo(
    () => getCurrentStreakDays(COMPLETED_DAYS),
    []
  );

  const longestStreak = useMemo(
    () => calculateLongestStreak(COMPLETED_DAYS),
    []
  );

  const completedCount = COMPLETED_DAYS.length;
  const currentStreakLength = currentStreakDays.length;

  // Datum-text för vald dag
  const { weekdayName, dayLabel } = useMemo(() => {
    const date = new Date(2025, 11, selectedDay); // 11 = December
    const weekdayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const dayLabel = `${selectedDay} December`;
    return { weekdayName, dayLabel };
  }, [selectedDay]);

  const todaysActivities: DayActivity[] = activitiesByDay[selectedDay] ?? [];

  const handleDayClick = (day: number) => {
    setSelectedDay(day); // bara välja – inte ändra streak/completion
  };

  return (
    <IonPage className="statsPage">
      <IonContent fullscreen>
        {/* --- Calendar Section (beige bakgrund) --- */}
        <div className="calendarContainer">
          <IonHeader className="ion-no-border headerTransparent">
            <IonToolbar>
              <IonButtons slot="start">
                <IonButton
                  fill="clear"
                  color="light"
                  routerLink="/dashboard"
                  routerDirection="back"
                >
                  <IonIcon icon={arrowBackOutline} className="backIcon" />
                </IonButton>
              </IonButtons>

              <IonButtons slot="end">
                <div className="streakBadge">
                  <IonIcon icon={flameOutline} className="flameIcon" />
                  <span className="streakNumber">{currentStreakLength}</span>
                </div>
              </IonButtons>
            </IonToolbar>
          </IonHeader>

          {/* Datumtext – uppdateras när man klickar en dag */}
          <div className="dateInfo">
            <p>{weekdayName}</p>
            <h1>{dayLabel}</h1>
          </div>

          {/* Kalendern (datumrutorna) */}
          <div className="calendarGrid">
            {allDays.map((day) => {
              const isCompleted = COMPLETED_DAYS.includes(day);
              const isInCurrentStreak = currentStreakDays.includes(day);
              const isCurrentDay = day === selectedDay;

              const classes = ['day'];
              if (isCompleted) classes.push('completedDay');
              if (isInCurrentStreak) classes.push('currentStreak');
              if (isCurrentDay) classes.push('currentDay');

              return (
                <div
                  key={day}
                  className={classes.join(' ')}
                  onClick={() => handleDayClick(day)}
                >
                  {day}
                </div>
              );
            })}
          </div>

          {/* Veckodagar längst ned, enligt Figma (Sat → Fri) */}
          <div className="dayLabels">
            <span>Sat</span>
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thr</span>
            <span>Fri</span>
          </div>
        </div>

        {/* --- My Stats (mörkblå del) --- */}
        <div className="statsContainer">
          <h2 className="statsTitle">My Stats</h2>
          <div className="statsGrid">
            <div className="statItem">
              <p className="statValue">{longestStreak}-days</p>
              <p className="statLabel">Longest Streak</p>
            </div>
            <div className="statItem">
              <p className="statValue">8 km</p>
              <p className="statLabel">Longest Walk</p>
            </div>
            <div className="statItem">
              <p className="statValue">{currentStreakLength}-days</p>
              <p className="statLabel">Current Streak</p>
            </div>
            <div className="statItem">
              <p className="statValue">{completedCount}</p>
              <p className="statLabel">Completed Days</p>
            </div>
          </div>

          {/* Aktiviteter för vald dag */}
          <div className="dayActivitySection">
            <h3 className="dayActivityTitle">Activity on this day</h3>
            {todaysActivities.length === 0 ? (
              <p className="dayActivityEmpty">No logged workouts</p>
            ) : (
              todaysActivities.map((act, idx) => (
                <div key={idx} className="dayActivityCard">
                  <p className="dayActivityCardTitle">{act.title}</p>
                  <p className="dayActivityCardSubtitle">{act.subtitle}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Calendar;
