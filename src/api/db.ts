import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // your initialized Firestore instance


export type Activity = {
    id: string,
    MET: number,
    Main: string,
    ActivityDesc: string
}

export type Workout = {
    user_name: string,
    weight: number,
    timestamp: string,
    workout_id: string,
    workout_length: number,
    calories_burned: number
}

export type DbFeedback = {
    success: boolean
    message: string
}

export const fetchActivities = async () => {
    const querySnapshot = await getDocs(collection(db, "met"));
    const activities = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
    return activities;
};


export const fetchWorkouts = async () => {
    const querySnapshot = await getDocs(collection(db, "workoutz"));
    const workouts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
    return workouts;
};



export const postWorkout = async (workout: Workout) => {
    try {
        await addDoc(collection(db, 'workoutz'), workout)
        return { success: true, message: "Workout saved to database" }
    } catch (err) {
        return { success: false, message: "Failed to save workout to database. Please try again later" }
    }
}