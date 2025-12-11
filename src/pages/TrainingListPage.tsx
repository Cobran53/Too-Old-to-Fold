import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonList,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonIcon,
  IonButton,
  IonLabel,
  IonItem,
  IonSegment,
  IonSegmentButton,
  IonModal,
} from '@ionic/react';

import {
  funnelOutline,
  timeOutline,
  walkOutline,
  barbellOutline,
  closeOutline,
} from 'ionicons/icons';

import './TrainingList.css';

type WorkoutType = 'walking' | 'strength' | 'balance';

type Workout = {
  id: number;
  title: string;
  duration: string;
  tag: string;
  description: string;
  image: string;
  type: WorkoutType;
};

const workouts: Workout[] = [
  {
    id: 1,
    title: 'Brisk walking',
    duration: '60 minutes · Walking',
    tag: 'For you',
    description: '7 km walk at a lively pace',
    image: '/walk.png',
    type: 'walking',
  },
  {
    id: 2,
    title: 'Safe steps',
    duration: '20 minutes · Balance',
    tag: 'At home',
    description: 'Simple at-home exercises to prevent falls',
    image: '/safesteps.png',
    type: 'balance',
  },
  {
    id: 3,
    title: 'Beginner Yoga',
    duration: '25 minutes · Strength',
    tag: 'For novices',
    description: 'Yoga poses adapted to novices, on a yoga rug',
    image: '/yoga.png',
    type: 'strength',
  },
  {
    id: 4,
    title: 'Stairs-based exercises',
    duration: '25 minutes · Balance',
    tag: 'Outside',
    description: 'Exercises using a step to help with balance',
    image: '/stairs.png',
    type: 'balance',
  },
];

const TrainingListPage: React.FC = () => {
  const [searchText, setSearchText] = React.useState('');
  const [activeFilter, setActiveFilter] = React.useState<'all' | WorkoutType>('all');

  const [selectedWorkout, setSelectedWorkout] = React.useState<Workout | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const filteredWorkouts = workouts.filter((w) => {
    const matchesSearch = w.title.toLowerCase().includes(searchText.toLowerCase());
    const matchesType = activeFilter === 'all' ? true : w.type === activeFilter;
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type: WorkoutType) => {
    if (type === 'walking') return walkOutline;
    return barbellOutline; // byt gärna ikon senare om du vill särskilja balance
  };

  const openDetails = (workout: Workout) => {
    setSelectedWorkout(workout);
    setIsModalOpen(true);
  };

  const closeDetails = () => {
    setIsModalOpen(false);
    setSelectedWorkout(null);
  };

  return (
    <IonPage className="training-page">
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonTitle className="training-title">Training</IonTitle>
          <IonButton slot="end" fill="clear" aria-label="Filter exercises">
            <IonIcon icon={funnelOutline} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="training-content">
        {/* Sökfält */}
        <IonSearchbar
          className="training-searchbar"
          placeholder="Find an exercise"
          value={searchText}
          onIonChange={(e) => setSearchText(e.detail.value ?? '')}
        />

        {/* Filtersegment */}
        <IonSegment
          value={activeFilter}
          onIonChange={(e) =>
            setActiveFilter((e.detail.value as 'all' | WorkoutType) ?? 'all')
          }
          mode="md"
          className="training-segment"
        >
          <IonSegmentButton value="all">
            <IonLabel>All</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="walking">
            <IonLabel>Walking</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="strength">
            <IonLabel>Strength</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="balance">
            <IonLabel>Balance</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {/* Lista med träningspass */}
        <IonList lines="none" className="training-list">
          {filteredWorkouts.map((workout) => (
            <IonCard
              key={workout.id}
              button
              onClick={() => openDetails(workout)}
              className="training-card"
            >
              <img
                src={workout.image}
                alt={workout.title}
                className="training-card-image"
              />

              <IonCardHeader>
                <IonCardTitle className="training-card-title">
                  {workout.title}
                </IonCardTitle>

                <IonCardSubtitle className="training-card-subtitle">
                  <IonIcon icon={timeOutline} className="training-time-icon" />
                  {workout.duration}
                </IonCardSubtitle>
              </IonCardHeader>

              <IonCardContent>
                <p className="training-card-description">{workout.description}</p>

                <IonItem lines="none" className="training-card-footer">
                  <IonIcon slot="start" icon={getTypeIcon(workout.type)} />
                  <IonLabel>{workout.tag}</IonLabel>

                  <IonButton slot="end" fill="clear" size="small">
                    ···
                  </IonButton>
                </IonItem>
              </IonCardContent>
            </IonCard>
          ))}
        </IonList>

        {/* Modal för detaljer */}
        <IonModal isOpen={isModalOpen} onDidDismiss={closeDetails}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>{selectedWorkout?.title ?? 'Training'}</IonTitle>
              <IonButton slot="end" fill="clear" onClick={closeDetails}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            {selectedWorkout && (
              <>
                <img
                  src={selectedWorkout.image}
                  alt={selectedWorkout.title}
                  style={{
                    width: '100%',
                    height: '180px',
                    objectFit: 'cover',
                    borderRadius: '16px',
                    marginBottom: '16px',
                  }}
                />

                <h2>{selectedWorkout.title}</h2>
                <p style={{ marginTop: 4, color: 'var(--ion-color-medium)' }}>
                  {selectedWorkout.duration} • {selectedWorkout.tag}
                </p>

                <p style={{ marginTop: 16 }}>{selectedWorkout.description}</p>

                <IonButton
                  expand="block"
                  style={{ marginTop: 24 }}
                  onClick={closeDetails}
                >
                  Start this workout
                </IonButton>
              </>
            )}
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default TrainingListPage;
