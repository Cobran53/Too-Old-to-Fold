import React from 'react';
import { IonIcon, IonRouterLink } from '@ionic/react';
import { walkOutline, arrowForwardOutline } from 'ionicons/icons';
import './Welcome.css';

const Welcome: React.FC = () => {
    return (
        <div className="welcome-screen">
            <div className="background-image-overlay"></div>
            <div className="content">
                <div className="running-icon">
                    <IonIcon icon={walkOutline} />
                </div>
                <div className="welcome-title">Welcome to Too Old to Fold</div>
                <IonRouterLink className="btn-get-started" routerLink="/dashboard"> 
                    Get Started <IonIcon icon={arrowForwardOutline} />
                </IonRouterLink>
            </div>
        </div>
    );
};

export default Welcome;