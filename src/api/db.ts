import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // your initialized Firestore instance


export type Activity = {
    id: string,
    MET: number,
    Main: string,
    ActivityDesc: string
}

export const fetchActivities = async () => {
    const querySnapshot = await getDocs(collection(db, "met"));
    const activities = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
    return activities;
};