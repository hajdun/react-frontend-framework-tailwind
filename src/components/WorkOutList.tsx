import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import type { WorkoutFormData } from "../types/workout";

const [workouts, setWorkouts] = useState<WorkoutFormData[]>([]);

useEffect(() => {
    const fetchWorkouts = async () => {
        const q = query(collection(db, "workouts"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setWorkouts(data as WorkoutFormData[]);
    };
    fetchWorkouts();
}, []);