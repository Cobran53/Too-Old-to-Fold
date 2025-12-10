import React from 'react';
import { IonCard, IonIcon } from '@ionic/react';
import { timeOutline } from 'ionicons/icons';
import './MiniWorkoutCard.css';

interface MiniWorkoutCardProps {
    title: string;
    time: string;
    description: string;
    imageSrc: string;
    imageAlt: string;
}

const MiniWorkoutCard: React.FC<MiniWorkoutCardProps> = ({ title, time, description, imageSrc, imageAlt }) => {
    return (
        <IonCard className="plan-card">
            
            {/* Use the imageSrc and imageAlt props here */}
            <img src={imageSrc} alt={imageAlt} className="card-image" />
            
            <div className="card-details">
                {/* Use the title prop */}
                <h4 className="plan-title">{title}</h4>
                
                <div className="plan-time">
                    <IonIcon icon={timeOutline} /> 
                    {/* Use the time prop */}
                    <span>{time}</span>
                </div>
                
                {/* Use the description prop */}
                <p className="plan-description">{description}</p>
            </div>
        </IonCard>
    );
};

export default MiniWorkoutCard;