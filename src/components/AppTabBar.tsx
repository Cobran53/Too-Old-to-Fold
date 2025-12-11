import React from 'react';
import { IonTabBar, IonTabButton, IonIcon } from '@ionic/react';
import { home, barbellOutline, barChartOutline } from 'ionicons/icons';
import './AppTabBar.css';

interface AppTabBarProps {
    // Optional: Pass the currently selected tab property for dynamic styling
    selectedTab?: string; 
}

const AppTabBar: React.FC<AppTabBarProps> = ({ selectedTab = 'home' }) => {
    return (
        // The slot="bottom" is crucial for positioning
        <IonTabBar slot="bottom" className="bottom-nav">
            
            {/* Plan Tab (Icon only, no label needed) */}
            <IonTabButton 
                tab="progress" 
                href="/progress" 
                className={`nav-item ${selectedTab === 'progress' ? 'active-tab' : ''}`}
            >
                <IonIcon icon={barChartOutline} />
                {selectedTab === 'progress' && <span className="nav-label">Progress</span>}
            </IonTabButton>
            
            {/* Home Tab: Shows the label span ONLY when active */}
            <IonTabButton 
                tab="home" 
                href="/dashboard" 
                className={`nav-item ${selectedTab === 'home' ? 'active-tab' : ''}`}
            >
                <IonIcon icon={home} />
                {/* Conditional rendering for the label span */}
                {selectedTab === 'home' && <span className="nav-label">Home</span>}
            </IonTabButton>

            {/* Workout Tab (Icon only, no label needed) */}
            <IonTabButton 
                tab="training" 
                href="/training-list" 
                className={`nav-item ${selectedTab === 'training' ? 'active-tab' : ''}`}
            >
                <IonIcon icon={barbellOutline} />
                {selectedTab === 'training' && <span className="nav-label">Training</span>}
            </IonTabButton>
        </IonTabBar>
    );
};

export default AppTabBar;
