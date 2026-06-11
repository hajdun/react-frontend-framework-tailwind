import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import type { WorkoutFormData } from "../types/workout";

// Inside your form component:
const onSubmit = async (data: WorkoutFormData) => {
    try {
        await addDoc(collection(db, "workouts"), {
            ...data,
            createdAt: serverTimestamp(),
        });
        console.log("Workout saved!");
    } catch (error) {
        console.error("Error saving workout:", error);
    }
};