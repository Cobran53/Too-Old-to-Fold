// src/hooks/useWorkouts.ts

import { useState, useEffect } from 'react';
// Assuming you have configured your project to handle YAML imports correctly
import workoutsYamlData from '/data/workouts.yaml?url'; 


// --- 1. DEFINE TYPES (Based on your YAML structure) ---

export type WorkoutLocation = 'outside' | 'inside' | 'both';
export type WorkoutCategory = 'balance' | 'strength' | 'walking';

export interface Workout {
    name: string;
    id: string;
    length: string;
    link_to_page: string;
    link_to_image: string;
    duration_minutes: number;
    location: WorkoutLocation;
    category: WorkoutCategory;
    description: string;
}


// --- 2. Data Source
// Ensure workoutsYamlData.workouts is correctly typed as an array of Workout objects
const WORKOUTS_DATA: Workout[] = workoutsYamlData.workouts || [];


// --- 3. UPDATED WorkoutCriteria INTERFACE
interface WorkoutCriteria {
    category?: WorkoutCategory;
    location?: WorkoutLocation;
    minDuration?: number; // New: Minimum duration in minutes
    maxDuration?: number; // New: Maximum duration in minutes
}

/**
 * Filters the workout data based on optional category, location, and duration criteria.
 * @param criteria - An object containing filtering parameters.
 * @returns A promise resolving to the filtered list of Workouts.
 */
const fetchFilteredWorkouts = (criteria: WorkoutCriteria): Promise<Workout[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const filtered = WORKOUTS_DATA.filter(workout => {
                let matches = true;

                // 1. Category Filter
                if (criteria.category && workout.category !== criteria.category) {
                    matches = false;
                }
                
                // 2. Location Filter
                if (criteria.location) {
                    // If the workout location is 'both', it satisfies any specific location filter
                    if (workout.location !== 'both' && workout.location !== criteria.location) {
                        matches = false;
                    }
                }
                
                // 3. Minimum Duration Filter (NEW)
                if (criteria.minDuration !== undefined && workout.duration_minutes < criteria.minDuration) {
                    matches = false;
                }

                // 4. Maximum Duration Filter (NEW)
                if (criteria.maxDuration !== undefined && workout.duration_minutes > criteria.maxDuration) {
                    matches = false;
                }
                
                return matches;
            });
            resolve(filtered);
        }, 100); // 100ms delay
    });
};

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