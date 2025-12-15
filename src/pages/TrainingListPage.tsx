import React from 'react';
import {
  IonPage,
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
  IonRange,
} from '@ionic/react';

import {
  funnelOutline,
  timeOutline,
  walkOutline,
  barbellOutline,
  closeOutline,
  sunnyOutline,
  homeOutline,
  bodyOutline,
} from 'ionicons/icons';

import './TrainingList.css';
import AppTabBar from '../components/AppTabBar';

type WorkoutType = 'walking' | 'strength' | 'balance';
type WorkoutLocation = 'outside' | 'inside';

type Workout = {
  id: number;
  title: string;
  duration: string;   // text som visas under titeln
  minutes: number;    // ren siffra för filterlogik
  tag: string;
  description: string;
  image: string;
  type: WorkoutType;
  location: WorkoutLocation;
};

const workouts: Workout[] = [
  {
    id: 1,
    title: 'Brisk walking',
    duration: '60 minutes · Walking',
    minutes: 60,
    tag: 'For you',
    description: '7 km walk at a lively pace',
    image: '/walk.png',
    type: 'walking',
    location: 'outside',
  },
  {
    id: 2,
    title: 'Safe steps',
    duration: '20 minutes · Balance',
    minutes: 20,
    tag: 'At home',
    description: 'Simple at-home exercises to prevent falls',
    image: '/safesteps.png',
    type: 'balance',
    location: 'inside',
  },
  {
    id: 3,
    title: 'Beginner Yoga',
    duration: '25 minutes · Strength',
    minutes: 25,
    tag: 'For novices',
    description: 'Yoga poses adapted to novices, on a yoga rug',
    image: '/yoga.png',
    type: 'strength',
    location: 'inside',
  },
  {
    id: 4,
    title: 'Stairs-based exercises',
    duration: '25 minutes · Balance',
    minutes: 25,
    tag: 'Outside',
    description: 'Exercises using a step to help with balance',
    image: '/stairs.png',
    type: 'balance',
    location: 'outside',
  },
];

const TrainingListPage: React.FC = () => {
  const [searchText, setSearchText] = React.useState('');
  const [activeFilter, setActiveFilter] =
    React.useState<'all' | WorkoutType>('all');

  const [selectedWorkout, setSelectedWorkout] =
    React.useState<Workout | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // NYTT: filterpanel-state
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [locationFilter, setLocationFilter] =
    React.useState<'any' | WorkoutLocation>('any');
  const [durationRange, setDurationRange] = React.useState({
    lower: 5,
    upper: 200,
  });

  const filteredWorkouts = workouts.filter((w) => {
    const matchesSearch = w.title
      .toLowerCase()
      .includes(searchText.toLowerCase());

    const matchesType = activeFilter === 'all' ? true : w.type === activeFilter;

    const matchesLocation =
      locationFilter === 'any' ? true : w.location === locationFilter;

    const matchesDuration =
      w.minutes >= durationRange.lower && w.minutes <= durationRange.upper;

    return matchesSearch && matchesType && matchesLocation && matchesDuration;
  });

  const getTypeIcon = (type: WorkoutType) => {
    if (type === 'walking') return walkOutline;
    if (type === 'strength') return barbellOutline;
    return bodyOutline; // för balance
  };

  const openDetails = (workout: Workout) => {
    setSelectedWorkout(workout);
    setIsModalOpen(true);
  };

  const closeDetails = () => {
    setIsModalOpen(false);
    setSelectedWorkout(null);
  };

  const avgDuration = Math.round(
    (durationRange.lower + durationRange.upper) / 2
  );

  return (
    <IonPage className="training-page">
      <IonContent fullscreen className="training-content">
        {/* Top-rad med titel + filter-knapp */}
        <div className="training-top-row">
          <h1 className="training-title">Training</h1>
          <IonButton
            fill="clear"
            aria-label="Filter exercises"
            className="training-filter-button"
            onClick={() => setIsFilterOpen((prev) => !prev)}
          >
            <IonIcon icon={funnelOutline} />
          </IonButton>
        </div>

        {/* Sökfält */}
        <IonSearchbar
          className="training-searchbar"
          placeholder="Find an exercise"
          value={searchText}
          onIonChange={(e) => setSearchText(e.detail.value ?? '')}
        />

        {/* FILTERPANEL – visas när man klickat på filtret */}
        {isFilterOpen && (
          <div className="training-filter-panel">
            {/* rad med filter-pills */}
            <div className="training-filter-pill-row">
              {/* Outside / Inside styr locationFilter */}
              <button
                className={`filter-pill ${
                  locationFilter === 'outside' ? 'active' : ''
                }`}
                onClick={() =>
                  setLocationFilter((prev) =>
                    prev === 'outside' ? 'any' : 'outside'
                  )
                }
              >
                <IonIcon icon={sunnyOutline} className="filter-pill-icon" />
                <span>Outside</span>
              </button>

              <button
                className={`filter-pill ${
                  locationFilter === 'inside' ? 'active' : ''
                }`}
                onClick={() =>
                  setLocationFilter((prev) =>
                    prev === 'inside' ? 'any' : 'inside'
                  )
                }
              >
                <IonIcon icon={homeOutline} className="filter-pill-icon" />
                <span>Inside</span>
              </button>

              {/* Dessa tre styr activeFilter (typ) */}
              <button
                className={`filter-pill ${
                  activeFilter === 'walking' ? 'active' : ''
                }`}
                onClick={() =>
                  setActiveFilter((prev) =>
                    prev === 'walking' ? 'all' : 'walking'
                  )
                }
              >
                <IonIcon icon={walkOutline} className="filter-pill-icon" />
                <span>Walking</span>
              </button>

              <button
                className={`filter-pill ${
                  activeFilter === 'balance' ? 'active' : ''
                }`}
                onClick={() =>
                  setActiveFilter((prev) =>
                    prev === 'balance' ? 'all' : 'balance'
                  )
                }
              >
                <IonIcon icon={bodyOutline} className="filter-pill-icon" />
                <span>Balance</span>
              </button>

              <button
                className={`filter-pill ${
                  activeFilter === 'strength' ? 'active' : ''
                }`}
                onClick={() =>
                  setActiveFilter((prev) =>
                    prev === 'strength' ? 'all' : 'strength'
                  )
                }
              >
                <IonIcon icon={barbellOutline} className="filter-pill-icon" />
                <span>Strength</span>
              </button>
            </div>

            {/* Duration-slider */}
            <div className="training-filter-range">
              <div className="filter-duration-chip">{avgDuration} min</div>

              <IonRange
                dualKnobs
                min={5}
                max={200}
                step={5}
                value={durationRange}
                onIonChange={(e) => {
                  const v = e.detail.value as any;
                  if (v && typeof v === 'object') {
                    setDurationRange({
                      lower: v.lower,
                      upper: v.upper,
                    });
                  }
                }}
              />

              <div className="filter-duration-bounds">
                <span>{durationRange.lower} min</span>
                <span>{durationRange.upper} min</span>
              </div>
            </div>
          </div>
        )}

        {/* Segment / kategorier – kan behållas som snabbfilter ovanpå panelen */}
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

              <IonCardHeader className="training-card-header">
                <IonCardTitle className="training-card-title">
                  {workout.title}
                </IonCardTitle>

                <IonCardSubtitle className="training-card-subtitle">
                  <IonIcon icon={timeOutline} className="training-time-icon" />
                  {workout.duration}
                </IonCardSubtitle>
              </IonCardHeader>

              <IonCardContent className="training-card-content">
                <p className="training-card-description">
                  {workout.description}
                </p>

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

      <AppTabBar selectedTab="training" />
    </IonPage>
  );
};

export default TrainingListPage;
