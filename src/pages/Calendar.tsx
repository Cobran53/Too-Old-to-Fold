import React from 'react';
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

const Calendar: React.FC = () => {
  return (
    <IonPage className="statsPage">
      <IonContent fullscreen>
        {/* --- Calendar Section (beige bakgrund) --- */}
        <div className="calendarContainer">
          <IonHeader className="ion-no-border headerTransparent">
            <IonToolbar>
              <IonButtons slot="start">
                {/* Tillbaka till dashboard/home */}
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
                  <span className="streakNumber">3</span>
                </div>
              </IonButtons>
            </IonToolbar>
          </IonHeader>

          {/* Datumtext */}
          <div className="dateInfo">
            <p>Wednesday</p>
            <h1>12 December</h1>
          </div>

          {/* Kalendern (datumrutorna) */}
          <div className="calendarGrid">
            <div className="day">1</div>
            <div className="day">2</div>
            <div className="day">3</div>
            <div className="day">4</div>
            <div className="day">5</div>
            <div className="day completedDay">6</div>
            <div className="day">7</div>

            <div className="day completedDay">8</div>
            <div className="day completedDay currentStreak">9</div>
            <div className="day completedDay currentStreak">10</div>
            <div className="day completedDay currentStreak">11</div>
            <div className="day currentDay">12</div>
            <div className="day">13</div>
            <div className="day">14</div>

            <div className="day">15</div>
            <div className="day">16</div>
            <div className="day">17</div>
            <div className="day">18</div>
            <div className="day">19</div>
            <div className="day">20</div>
            <div className="day">21</div>

            <div className="day">22</div>
            <div className="day">23</div>
            <div className="day">24</div>
            <div className="day">25</div>
            <div className="day">26</div>
            <div className="day">27</div>
            <div className="day">28</div>

            <div className="day">29</div>
            <div className="day">30</div>
            <div className="day">31</div>
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
              <p className="statValue">32-days</p>
              <p className="statLabel">Longest Streak</p>
            </div>
            <div className="statItem">
              <p className="statValue">8 km</p>
              <p className="statLabel">Longest Walk</p>
            </div>
            <div className="statItem">
              <p className="statValue">3-days</p>
              <p className="statLabel">Current Streak</p>
            </div>
            <div className="statItem">
              <p className="statValue">53</p>
              <p className="statLabel">Completed Days</p>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Calendar;
