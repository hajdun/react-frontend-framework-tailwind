// src/types/workout.ts
export interface WorkoutFormData {
    id?: string;
    exerciseName: string;
    sets: number;
    reps: number;
    weight?: number;
    createdAt?: unknown; // Firestore Timestamp
}