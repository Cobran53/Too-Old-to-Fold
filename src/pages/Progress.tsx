import React from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonFooter,
} from '@ionic/react';
import {
  calendarOutline,
  addCircle,
  walkOutline,
  scaleOutline,
  ellipsisVerticalOutline,
  barChartOutline,
  homeOutline,
  fitnessOutline,
} from 'ionicons/icons';
import './Progress.css';
import AppTabBar from '../components/AppTabBar';

const Progress: React.FC = () => {
  return (
    <IonPage className='full-page'>
      {/* Header */}
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonTitle>Progress Tracker</IonTitle>
          <IonButtons slot="end">
            <IonButton color="dark">
              <IonIcon icon={calendarOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      {/* Content */}
      <IonContent fullscreen>
        <div className="ion-padding">
          {/* Today's Target Progress Card */}
          <div className="progressCard">
            <div className="progressHeader">
              <h2>Today's Target Progress</h2>
              <IonIcon icon={addCircle} className="addIcon" />
            </div>
            <div className="progressDetails">
              <div className="progressItem">
                <p className="value">0/1</p>
                <p className="label">Workouts completed</p>
              </div>
              <div className="progressItem">
                <p className="value">30/60</p>
                <p className="label">Minutes walked</p>
              </div>
            </div>
          </div>

          {/* Activity Progress Section */}
          <div className="sectionHeader">
            <h2>Activity Progress</h2>
            <IonSelect
              interface="popover"
              value="weekly"
              className="weeklySelect"
            >
              <IonSelectOption value="weekly">Weekly</IonSelectOption>
              <IonSelectOption value="monthly">Monthly</IonSelectOption>
            </IonSelect>
          </div>

          {/* Weekly Bar Chart */}
          <div className="barChartCard">
            <div className="barChartContainer">
              {/* Static Data represented by the inline 'style' for height */}
              {/* Sun */}
              <div className="barColumn">
                <div className="bar barDark" style={{ height: '40%' }}></div>
                <div className="dayLabel">Sun</div>
              </div>
              {/* Mon */}
              <div className="barColumn">
                <div className="bar barLight" style={{ height: '70%' }}></div>
                <div className="dayLabel">Mon</div>
              </div>
              {/* Tue */}
              <div className="barColumn">
                <div className="bar barDark" style={{ height: '50%' }}></div>
                <div className="dayLabel">Tue</div>
              </div>
              {/* Wed */}
              <div className="barColumn">
                <div className="bar barLight" style={{ height: '60%' }}></div>
                <div className="dayLabel">Wed</div>
              </div>
              {/* Thu */}
              <div className="barColumn">
                <div className="bar barDark" style={{ height: '90%' }}></div>
                <div className="dayLabel">Thu</div>
              </div>
              {/* Fri */}
              <div className="barColumn">
                <div className="bar barLight" style={{ height: '35%' }}></div>
                <div className="dayLabel">Fri</div>
              </div>
              {/* Sat */}
              <div className="barColumn">
                <div className="bar barDark" style={{ height: '65%' }}></div>
                <div className="dayLabel">Sat</div>
              </div>
            </div>
          </div>

          {/* Latest Activity Section */}
          <div className="sectionHeader latestActivityHeader">
            <h2>Latest Activity</h2>
            <a href="#">See more</a>
          </div>

          {/* Activity Item 1: Walk */}
          <div className="activityItem">
            <div className="activityIconBox">
              <IonIcon icon={walkOutline} className="iconDark" />
            </div>
            <div className="activityDetails">
              <h3>30 Minute Walk</h3>
              <p>About 20 minutes ago</p>
            </div>
            <IonIcon icon={ellipsisVerticalOutline} className="moreIcon" />
          </div>

          {/* Activity Item 2: Balance */}
          <div className="activityItem">
            <div className="activityIconBox balanceIconBox">
              <IonIcon icon={scaleOutline} className="iconLight" />
            </div>
            <div className="activityDetails">
              <h3>Balance Circuit 2</h3>
              <p>Yesterday</p>
            </div>
            <IonIcon icon={ellipsisVerticalOutline} className="moreIcon" />
          </div>
        </div>
      </IonContent>

      <AppTabBar selectedTab="progress" />
    </IonPage>
  );
};

export default Progress;