// src/hooks/useWorkouts.ts

import { useState, useEffect } from 'react';
import { open as dbOpen, run as dbRun, close as dbClose } from './sqlite';



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
    // Optional: number of workouts to return (random selection)
    count?: number;
}

const fetchFilteredWorkouts = async (criteria: WorkoutCriteria): Promise<Workout[]> => {
    // Helper for filtering
    const applyFilters = (items: Workout[]) => items.filter(workout => {
        if (criteria.category && workout.category !== criteria.category) return false;
        if (criteria.location) {
            if (workout.location !== 'both' && workout.location !== criteria.location) return false;
        }
        if (criteria.minDuration !== undefined && workout.duration_minutes < criteria.minDuration) return false;
        if (criteria.maxDuration !== undefined && workout.duration_minutes > criteria.maxDuration) return false;
        return true;
    });

    const DB_NAME = 'appdb';
    try {
        await dbOpen(DB_NAME);
        const res: any = await dbRun('SELECT id, title, duration, metadata FROM workouts');
        // plugin may return different shapes; normalize to an array of rows
        const rows: any[] = (res && (res.values || res.results || res.rows)) ? (res.values || res.results || res.rows) : (Array.isArray(res) ? res : []);

        const mapped = rows.map((r: any) => {
            const metadata = r.metadata || r.metadata_json || r.metadataText || r.metadataString || r[ 'metadata' ] || null;
            return mapRowToWorkout(r.title || r.name || r[1] || '', r.duration ?? r.duration_minutes ?? 0, typeof metadata === 'string' ? metadata : JSON.stringify(metadata || {}));
        });

        await dbClose();

        // Apply filters
        const filtered = applyFilters(mapped);

        // If a count was requested, return a random selection of the filtered results
        if (criteria.count && Number(criteria.count) > 0) {
            const n = Math.max(0, Math.floor(Number(criteria.count)));
            if (n >= filtered.length) return filtered;

            // Fisher-Yates shuffle copy
            const shuffled = (() => {
                const a = filtered.slice();
                for (let i = a.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
                }
                return a;
            })();

            return shuffled.slice(0, n);
        }

        return filtered;
    } catch (error) {
        console.error('[useWorkouts] Error fetching workouts from DB:', error);
        try { await dbClose(); } catch (e) {}
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
                console.error("[useWorkouts] Failed to fetch workouts:", error);
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