import { IonContent, IonHeader, IonRouterLink, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { useHistory } from 'react-router-dom';
import ExploreContainer from '../components/ExploreContainer';
import './Navigation.css';

const Navigation: React.FC = () => {
  const history = useHistory();

  const navigateToStandardHome = () => {
    history.push('/standard-home');
  };

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
      </IonContent>
    </IonPage>
  );
};

export default Navigation;
