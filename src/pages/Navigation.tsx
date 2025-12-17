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
            <IonTitle size="large">Navigation Page DEBUG</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonRouterLink className="btn-get-started" href="/welcome"> 
          Welcome Page
        </IonRouterLink>
        <IonRouterLink className="btn-get-started" href="/dashboard"> 
          Dashboard Page
        </IonRouterLink>
        <IonRouterLink className="btn-get-started" href="/progress"> 
          Progress Page
        </IonRouterLink>
        <IonRouterLink className="btn-get-started" href="/training-list">
          Training List Page
        </IonRouterLink>
        <IonRouterLink className="btn-get-started" href="/settings">
          Settings Page
        </IonRouterLink>
        <IonRouterLink className="btn-get-started" href="/calendar">
          Calendar Page
        </IonRouterLink>
        <IonRouterLink className="btn-get-started" href="/activity-log">
          Activity Log Page
        </IonRouterLink>
      </IonContent>
    </IonPage>
  );
};

export default Navigation;
