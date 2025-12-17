import { IonContent, IonHeader, IonRouterLink, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import './Navigation.css';

const Navigation: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Blank</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Blank</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonRouterLink className="btn-get-started" routerLink="/welcome"> 
          Welcome Page
        </IonRouterLink>
        <IonRouterLink className="btn-get-started" routerLink="/dashboard"> 
          Dashboard Page
        </IonRouterLink>
        <IonRouterLink className="btn-get-started" routerLink="/progress"> 
          Progress Page
        </IonRouterLink>
        <IonRouterLink className="btn-get-started" routerLink="/training-list">
          Training List Page
        </IonRouterLink>
        <IonRouterLink className="btn-get-started" routerLink="/settings">
          Settings Page
        </IonRouterLink>
        <IonRouterLink className="btn-get-started" routerLink="/calendar">
          Calendar Page
        </IonRouterLink>
        <IonRouterLink className="btn-get-started" routerLink="/activity-log">
          Activity Log Page
        </IonRouterLink>
      </IonContent>
    </IonPage>
  );
};

export default Navigation;
