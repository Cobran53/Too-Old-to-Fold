// src/hooks/useWorkouts.ts

import { useState, useEffect } from 'react';
// Fallback for web (static JSON export)
import workoutsJsonData from '../data/workouts.json';


// --- 1. DEFINE TYPES (Based on your YAML structure) ---

export type WorkoutLocation = 'outside' | 'inside' | 'both';
export type WorkoutCategory = 'balance' | 'strength' | 'walking';

export interface Workout {
    name: string;
    id: string;
    length: string;
    link_to_page: string;
    link_to_image?: string;
    duration_minutes: number;
    location: WorkoutLocation;
    category: WorkoutCategory;
    description: string;
}


// --- 2. Data Source (read from DB)
// We'll load rows from the `workouts` table and map them to `Workout` objects.


// --- 3. UPDATED WorkoutCriteria INTERFACE
interface WorkoutCriteria {
    category?: WorkoutCategory;
    location?: WorkoutLocation;
    minDuration?: number;
    maxDuration?: number;
}

/**
 * Filters the workout data based on optional category, location, and duration criteria.
 * @param criteria - An object containing filtering parameters.
 * @returns A promise resolving to the filtered list of Workouts.
 */
const fetchFilteredWorkouts = async (criteria: WorkoutCriteria): Promise<Workout[]> => {
    // Helper pour filtrer
    const applyFilters = (items: Workout[]) => items.filter(workout => {
        if (criteria.category && workout.category !== criteria.category) return false;
        if (criteria.location) {
            if (workout.location !== 'both' && workout.location !== criteria.location) return false;
        }
        if (criteria.minDuration !== undefined && workout.duration_minutes < criteria.minDuration) return false;
        if (criteria.maxDuration !== undefined && workout.duration_minutes > criteria.maxDuration) return false;
        return true;
    });

    try {
        // Utilise la logique multiplateforme de openDb
        const openDb = (await import('./sqlite')).default;
        const db = await openDb();
        if (db && typeof db.all === 'function') {
            // SQLite natif ou Capacitor
            const rows: Array<{ title: string; duration: number; metadata: string }> = await db.all(
                'SELECT title, duration, metadata FROM workouts'
            );
            if (typeof db.close === 'function') await db.close();
            const mapped = rows.map(r => mapRowToWorkout(r.title, r.duration, r.metadata));
            return applyFilters(mapped);
        }
        // Si pas de base, ne retourne rien
        return [];
    } catch (error) {
        console.error('Error fetching workouts:', error);
        return [];
    }
};

// Helper to map DB row to Workout
function mapRowToWorkout(title: string, duration: number, metadata: string): Workout {
    let meta: any = {};
    try { meta = typeof metadata === 'string' ? JSON.parse(metadata) : (metadata || {}); } catch (e) { meta = {}; }
    return {
        name: title,
        id: meta.uid || String(Math.random()).slice(2),
        length: meta.length || 'N/A',
        link_to_page: meta.link_to_page || '/',
        link_to_image: meta.link_to_image,
        duration_minutes: typeof duration === 'number' ? duration : (meta.duration_minutes || 0),
        location: (meta.location || 'inside') as WorkoutLocation,
        category: (meta.category || 'strength') as WorkoutCategory,
        description: meta.description || ''
    };
}

// --- 4. THE REACT HOOK (Manages State and Calls Logic) ---

/**
 * Custom hook to fetch and manage the list of workouts based on criteria.
 * @param criteria - The filters to apply to the workout list.
 * @returns The list of filtered workouts and loading state.
 */
const useWorkouts = (criteria: WorkoutCriteria = {}) => {
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Create a stable dependency array key to prevent unnecessary re-runs
    // We stringify the criteria object for deep comparison
    const criteriaKey = JSON.stringify(criteria);

    useEffect(() => {
        // Ensure criteria is parsed back from the key string for use in logic
        const currentCriteria = JSON.parse(criteriaKey);

        setIsLoading(true);
        // Call the data fetching/filtering logic
        fetchFilteredWorkouts(currentCriteria)
            .then(data => {
                setWorkouts(data);
            })
            .catch(error => {
                console.error("Failed to fetch workouts:", error);
                setWorkouts([]); 
            })
            .finally(() => {
                setIsLoading(false);
            });
        
        // Use the stringified key in the dependency array
    }, [criteriaKey]); 

    return { workouts, isLoading };
};

export default useWorkouts;