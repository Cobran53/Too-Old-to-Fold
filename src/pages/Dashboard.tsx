import React from 'react';
import { 
    IonPage, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonIcon, 
    IonGrid, 
    IonRow, 
    IonCol, 
    IonCard, 
    IonCardContent, 
    IonRouterLink,
    IonTabBar,
    IonTabButton
} from '@ionic/react';
import { 
    settingsOutline, 
    timeOutline, 
    home, 
    barbellOutline, 
    listOutline 
} from 'ionicons/icons';
import './Dashboard.css';
import MiniWorkoutCard from '../components/MiniWorkoutCard';
import GoalCard from '../components/GoalCard';
import AppTabBar from '../components/AppTabBar';

const Dashboard: React.FC = () => {
    return (
        <IonPage className="dashboard-page">
            <IonHeader className="ion-no-border">
                <IonToolbar>
                    <IonTitle slot="start" className="month-title">July 2026</IonTitle>
                    <IonIcon icon={settingsOutline} slot="end" className="settings-icon" />
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen className="ion-padding dashboard-content">
                <section className="date-picker-section">
                    <div className="date-picker">
                        {['S 10', 'M 11', 'Tu 12', 'W 13', 'Th 14', 'F 15', 'S 16'].map((day, index) => (
                            <div key={index} className={`day-card ${day === 'Tu 12' ? 'active' : 'inactive'}`}>
                                {day.split(' ').map((part, i) => (
                                    <span key={i} className={i === 1 ? 'date-number' : 'day-letter'}>{part}</span>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className="date-dots">
                        <span className="dot active"></span>
                        <span className="dot"></span>
                    </div>
                </section>

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

                <section className="weekly-goals">
                    <h3 className="section-title">Weakly Goals</h3>

                    <IonGrid className="goals-container">
                        <IonRow>
                            <GoalCard
                                title="Strength"
                                minText='mins left'
                                minimumValue={55}
                                completionPercentage={40}
                            />

                            <GoalCard
                                title="Distance"
                                minText='steps left'
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