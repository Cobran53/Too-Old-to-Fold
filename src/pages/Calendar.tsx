//TODO DOES NOT WORK
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
import {
  arrowBackOutline,
  flame,
} from 'ionicons/icons';
import './Calendar.css';

const Calendar: React.FC = () => {
  return (
    <IonPage className="statsPage">
      <IonContent fullscreen>
        {/* --- Calendar Section (Dark Background) --- */}
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
                  <IonIcon icon={flame} className="flameIcon" />
                  <span className="streakNumber">3</span>
                </div>
              </IonButtons>
            </IonToolbar>
          </IonHeader>

          {/* Date Info */}
          <div className="dateInfo">
            <p>Thursday</p>
            <h1>11 December</h1>
          </div>

          {/* Calendar Grid */}
          <div className="calendarGrid">
            {/* Week 1 */}
            <div className="day">1</div>
            <div className="day">2</div>
            <div className="day">3</div>
            <div className="day">4</div>
            <div className="day">5</div>
            <div className="day completedDay">6</div>
            <div className="day">7</div>

            {/* Week 2 */}
            <div className="day completedDay">8</div>
            <div className="day completedDay currentStreak">9</div>
            <div className="day completedDay currentStreak">10</div>
            <div className="day completedDay currentStreak">11</div>
            <div className="day currentDay">12</div> {/* Underlined */}
            <div className="day">13</div>
            <div className="day">14</div>

            {/* Week 3 */}
            <div className="day">15</div>
            <div className="day">16</div>
            <div className="day">17</div>
            <div className="day">18</div>
            <div className="day">19</div>
            <div className="day">20</div>
            <div className="day">21</div>

            {/* Week 4 */}
            <div className="day">22</div>
            <div className="day">23</div>
            <div className="day">24</div>
            <div className="day">25</div>
            <div className="day">26</div>
            <div className="day">27</div>
            <div className="day">28</div>

            {/* Week 5 */}
            <div className="day">29</div>
            <div className="day">30</div>
            <div className="day">31</div>
          </div>

          {/* Day Labels */}
          <div className="dayLabels">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thr</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>

        {/* --- My Stats Section (Dark Blue Background) --- */}
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