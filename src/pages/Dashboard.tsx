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
    // State to hold the selected date (default is today)
    const [selectedDateKey, setSelectedDateKey] = useState(getDateKey(new Date()));
    // State to hold the array of dates to display
    const [datesToDisplay, setDatesToDisplay] = useState<Date[]>([]);

    useEffect(() => {
        const today = new Date();
        const days = [];
        
        // 1. Calculate the start date (3 days before today)
        // Clone today's date and subtract 3 days
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 3);

        // 2. Generate 11 days (3 before, today, 7 after)
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
        // You would typically add logic here to load data for the selected day
        console.log(`Date selected: ${newSelectedKey}`);
    };
    
    return (
        <IonPage className="dashboard-page">
            <IonHeader className="ion-no-border">
                <IonToolbar>
                    <IonTitle slot="start" className="month-title">{new Date().toLocaleString('en', { month: 'long' })} {new Date().getFullYear()}</IonTitle>
                    <IonIcon icon={settingsOutline} slot="end" className="settings-icon" />
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen className="ion-padding dashboard-content">
                <section className="date-picker-section">
                    <div className="date-picker">
                        {/* {['S 10', 'M 11', 'Tu 12', 'W 13', 'Th 14', 'F 15', 'S 16', 'M 17', 'Tu 18'].map((day, index) => (
                            <div key={index} className={`day-card ${day === 'Tu 12' ? 'active' : 'inactive'}`}>
                                {day.split(' ').map((part, i) => (
                                    <span key={i} className={i === 1 ? 'date-number' : 'day-letter'}>{part}</span>
                                ))}
                            </div>
                        ))}
                         */}
                        {datesToDisplay.map((date, index) => {
                            const dayString = formatDate(date);
                            const dateKey = getDateKey(date);
                            const parts = dayString.split(' ');
                            const isActive = dateKey === selectedDateKey;

                            return (
                                // Add onClick handler to make the card clickable
                                <div 
                                    key={dateKey} // Use the unique date key
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
                    <h3 className="section-title">Wekly Goals</h3>

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

// import React, { useState, useEffect } from 'react';
// import { 
//     IonPage, 
//     IonHeader, 
//     IonToolbar, 
//     IonTitle, 
//     IonContent, 
//     IonIcon, 
//     IonGrid, 
//     IonRow, 
//     IonCol, 
//     IonCard, 
//     IonCardContent, 
//     IonRouterLink,
//     IonTabBar,
//     IonTabButton
// } from '@ionic/react';
// import { 
//     settingsOutline, 
//     timeOutline, 
//     home, 
//     barbellOutline, 
//     listOutline 
// } from 'ionicons/icons';
// import './Dashboard.css';
// import MiniWorkoutCard from '../components/MiniWorkoutCard';
// import GoalCard from '../components/GoalCard';
// import AppTabBar from '../components/AppTabBar';
// import useWorkouts from '../services/useWorkouts';

// const formatDate = (date: Date): string => {
//     const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//     const dayOfWeek = dayNames[date.getDay()];
//     const dateNumber = date.getDate();
//     return `${dayOfWeek} ${dateNumber}`;
// };

// const getDateKey = (date: Date): string => {
//     return date.toISOString().split('T')[0];
// };

// const Dashboard: React.FC = () => {
//     // State to hold the selected date (default is today)
//     const [selectedDateKey, setSelectedDateKey] = useState(getDateKey(new Date()));
//     // State to hold the array of dates to display
//     const [datesToDisplay, setDatesToDisplay] = useState<Date[]>([]);

//     useEffect(() => {
//         const today = new Date();
//         const days = [];
        
//         // 1. Calculate the start date (3 days before today)
//         // Clone today's date and subtract 3 days
//         const startDate = new Date(today);
//         startDate.setDate(today.getDate() - 3);

//         // 2. Generate 11 days (3 before, today, 7 after)
//         for (let i = 0; i < 11; i++) {
//             const nextDay = new Date(startDate);
//             nextDay.setDate(startDate.getDate() + i);
//             days.push(nextDay);
//         }

//         setDatesToDisplay(days);
//     }, []);

//     const handleDateClick = (date: Date) => {
//         const newSelectedKey = getDateKey(date);
//         setSelectedDateKey(newSelectedKey);
//         // You would typically add logic here to load data for the selected day
//         console.log(`Date selected: ${newSelectedKey}`);
//     };
    
//     const { workouts, isLoading } = useWorkouts();

//     return (
//         <IonPage className="dashboard-page">
//             <IonHeader className="ion-no-border">
//                 <IonToolbar>
//                     <IonTitle slot="start" className="month-title">{new Date().toLocaleString('en', { month: 'long' })} {new Date().getFullYear()}</IonTitle>
//                     <IonIcon icon={settingsOutline} slot="end" className="settings-icon" />
//                 </IonToolbar>
//             </IonHeader>

//             <IonContent fullscreen className="ion-padding dashboard-content">
//                 <section className="date-picker-section">
//                     <div className="date-picker">
//                         {/* {['S 10', 'M 11', 'Tu 12', 'W 13', 'Th 14', 'F 15', 'S 16', 'M 17', 'Tu 18'].map((day, index) => (
//                             <div key={index} className={`day-card ${day === 'Tu 12' ? 'active' : 'inactive'}`}>
//                                 {day.split(' ').map((part, i) => (
//                                     <span key={i} className={i === 1 ? 'date-number' : 'day-letter'}>{part}</span>
//                                 ))}
//                             </div>
//                         ))}
//                          */}
//                         {datesToDisplay.map((date, index) => {
//                             const dayString = formatDate(date);
//                             const dateKey = getDateKey(date);
//                             const parts = dayString.split(' ');
//                             const isActive = dateKey === selectedDateKey;

//                             return (
//                                 // Add onClick handler to make the card clickable
//                                 <div 
//                                     key={dateKey} // Use the unique date key
//                                     className={`day-card ${isActive ? 'active' : 'inactive'}`}
//                                     onClick={() => handleDateClick(date)}
//                                 >
//                                     {parts.map((part, i) => (
//                                         <span 
//                                             key={i} 
//                                             className={i === 1 ? 'date-number' : 'day-letter'}
//                                         >
//                                             {part}
//                                         </span>
//                                     ))}
//                                 </div>
//                             );
//                         })}
                    
//                     </div>
//                     <div className="date-dots">
//                         <span className="dot active"></span>
//                         <span className="dot"></span>
//                     </div>
//                 </section>

//                 <section className="todays-plan">
//                     <h3 className="section-title">Today's Plan</h3>

//                     {workouts.forEach((workout, index) => (
//                         <MiniWorkoutCard
//                             key={index}
//                             title={workout.title}
//                             time={workout.time}
//                             description={workout.description}
//                             imageSrc={workout.imageSrc}
//                             imageAlt={workout.imageAlt}
//                         />
//                     ))}
//                 </section>

//                 <section className="weekly-goals">
//                     <h3 className="section-title">Weekly Goals</h3>

//                     <IonGrid className="goals-container">
//                         <IonRow>
//                             <GoalCard
//                                 title="Strength"
//                                 minText='mins left'
//                                 minimumValue={55}
//                                 completionPercentage={40}
//                             />

//                             <GoalCard
//                                 title="Distance"
//                                 minText='steps left'
//                                 minimumValue={500}
//                                 completionPercentage={80}
//                             />
//                         </IonRow>
//                     </IonGrid>
//                 </section>
                
//             </IonContent>

//             <AppTabBar selectedTab="home" />

//         </IonPage>
//     );
// };

// export default Dashboard;