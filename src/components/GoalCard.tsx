// GoalCard.tsx (New Component File)
import React from 'react';
import { IonCard, IonCardContent, IonCol } from '@ionic/react';
import './GoalCard.css';

// 1. Define the TypeScript Interface for the component's props
interface GoalCardProps {
    title: string;
    minText: string; // e.g., "mins left"
    minimumValue: number; // e.g., 60
    completionPercentage: number; // e.g., 65
}

const GoalCard: React.FC<GoalCardProps> = ({ title, minText, minimumValue, completionPercentage }) => {
    
    // Calculate the remaining percentage
    const targetPercentage = 100 - completionPercentage;

    // SVG path attributes (dynamic values used in strokeDasharray)
    const progressDone = `${completionPercentage}, 100`;
    const progressTodo = `${targetPercentage}, 100`;

    // Note: The `transform: rotate(...)` in CSS is needed to align the progress arc correctly.
    // The starting rotation for the 'todo' arc needs to be adjusted based on the 'completionPercentage'.
    // 360 * (completionPercentage / 100) = total rotation angle
    const todoRotation = `${360 * (completionPercentage / 100)}deg`;

    return (
        <IonCol size="6">
            <IonCard className="goal-card">
                <IonCardContent className="goal-content">
                    <h4 className="goal-title">{title}</h4>
                    
                    {/* SVG Chart Structure */}
                    <svg viewBox="0 0 36 36" className="circular-chart">
                        {/* Background ring */}
                        <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                        
                        {/* Progress Done (e.g., 65%) */}
                        <path 
                            className="circle-progress-done" 
                            strokeDasharray={progressDone} 
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        ></path>

                        {/* Progress To Do (e.g., 35%) - We'll use CSS to rotate this to the correct start position */}
                        <path 
                            className="circle-progress-todo" 
                            strokeDasharray={progressTodo} 
                            style={{ transform: `rotate(${todoRotation})` }}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        ></path>

                        {/* Text: Min above 60 */}
                        <text x="18" y="24" className="chart-text min-text">{minText}</text> {/* Adjusted Y for Min */}
                        <text x="18" y="16.5" className="chart-text value-text">{minimumValue}</text> {/* Adjusted Y for Value */}
                    </svg>
                    
                    <div className="goal-legend">
                        <span className="done-dot"></span> {completionPercentage}%
                        <span className="todo-dot"></span> {targetPercentage}%
                    </div>
                </IonCardContent>
            </IonCard>
        </IonCol>
    );
};

export default GoalCard;