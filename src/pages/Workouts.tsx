import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import Badge from "../components/Badge";
import {
    fetchActivities,
    fetchWorkouts,
    type Activity,
    type Workout,
} from "../api/db";

const typeColor = {
    Cardio: "teal",
    Strength: "orange",
    Flexibility: "green",
} as const;

const FILTERS = ["All", "Strength", "Cardio", "Flexibility"] as const;

type WorkoutType = keyof typeof typeColor;

type WorkoutCardItem = {
    id: string;
    name: string;
    type: WorkoutType;
    duration: string;
    cal: number;
    exercises: number;
    notes?: string;
    timestamp?: string;
    userName: string;
};

function formatDuration(hours: number) {
    const mins = Math.round(hours * 60);
    return `${mins} min`;
}

function inferType(main?: string): WorkoutType {
    const value = (main || "").toLowerCase();

    if (
        value.includes("running") ||
        value.includes("bicycling") ||
        value.includes("walking") ||
        value.includes("cardio") ||
        value.includes("conditioning")
    ) {
        return "Cardio";
    }

    if (
        value.includes("stretching") ||
        value.includes("yoga") ||
        value.includes("flexibility")
    ) {
        return "Flexibility";
    }

    return "Strength";
}

export default function Workouts() {
    const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
    const [activities, setActivities] = useState<Activity[]>([]);
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError("");

                const [activityData, workoutData] = await Promise.all([
                    fetchActivities(),
                    fetchWorkouts(),
                ]);

                setActivities(activityData);
                setWorkouts(workoutData);
            } catch (err) {
                console.error(err);
                setError("Failed to load workouts.");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const workoutCards = useMemo<WorkoutCardItem[]>(() => {
        return workouts.map((workout, index) => {
            const activity = activities.find((wa) => wa.id == workout.workout_id);

            const type = inferType(activity?.Main);
            const name =
                activity?.ActivityDesc ||
                activity?.Main ||
                `Workout ${index + 1}`;

            const baseDate = new Date(parseInt(workout.timestamp))

            const displayDate = new Intl.DateTimeFormat("en-GB", {
                weekday: "long",
                year: "numeric",
                month: "short",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
            }).format(baseDate)

            return {
                id: workout.timestamp || `${workout.workout_id}-${index}`,
                name,
                type,
                duration: formatDuration(workout.workout_length),
                cal: Math.round(workout.calories_burned),
                exercises: 1,
                notes: `${workout?.notes}`,
                timestamp: workout.timestamp,
                displayDate: displayDate,
                userName: workout.user_name,
            };
        });
    }, [activities, workouts]);

    const filtered =
        filter === "All"
            ? workoutCards
            : workoutCards.filter((w) => w.type === filter);

    return (
        <div className="space-y-6">
            {/* Header */}
            <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <p className="text-sm font-medium text-[#ADA4A5]">Workout library</p>
                    <h1 className="mt-1 text-[32px] font-bold leading-none tracking-[-0.03em] text-[#1D1617]">
                        Workouts
                    </h1>
                    <p className="mt-3 text-sm text-[#ADA4A5]">
                        {workoutCards.length} workouts logged
                    </p>
                </div>

                <Link to="/post_workout">
                    <button className="rounded-full bg-[linear-gradient(135deg,#7B61FF_0%,#A678F7_100%)] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(123,97,255,0.22)] transition hover:scale-[1.01]">
                        + Log Workout
                    </button>
                </Link>
            </section>

            {/* Schedule-style hero strip */}
            <section className="rounded-[24px] bg-[#F3E6FA] px-5 py-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-[#1D1617]">
                            Workouts
                        </h2>
                        <p className="mt-1 text-sm text-[#ADA4A5]">
                            Filter your sessions and review recent workout history.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {FILTERS.map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${filter === f
                                    ? "bg-[linear-gradient(135deg,#DA8FFF_0%,#9B5FFF_100%)] text-white shadow-[0_8px_18px_rgba(123,97,255,0.18)]"
                                    : "bg-white text-[#7B6F72] hover:text-[#1D1617]"
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Loading */}
            {loading && (
                <div className="grid gap-4 md:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Card
                            key={i}
                            className="rounded-[24px] border-0 bg-white shadow-[0_8px_24px_rgba(29,22,23,0.05)]"
                        >
                            <div className="animate-pulse space-y-4">
                                <div className="h-5 w-32 rounded-full bg-[#F3F3F3]" />
                                <div className="h-4 w-40 rounded-full bg-[#F3F3F3]" />
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="h-12 rounded-[16px] bg-[#F7F8F8]" />
                                    <div className="h-12 rounded-[16px] bg-[#F7F8F8]" />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Error */}
            {!loading && error && (
                <Card className="rounded-[24px] border-0 bg-[#FFF1F4] shadow-none">
                    <p className="text-sm font-medium text-[#FF6B9D]">{error}</p>
                </Card>
            )}

            {/* Empty */}
            {!loading && !error && filtered.length === 0 && (
                <Card className="rounded-[24px] border-0 bg-white text-center shadow-[0_8px_24px_rgba(29,22,23,0.05)]">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,#7B61FF_0%,#C084FC_100%)] text-white shadow-[0_10px_28px_rgba(123,97,255,0.22)]">
                        <svg
                            width="26"
                            height="26"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M12 5v14" />
                            <path d="M5 12h14" />
                        </svg>
                    </div>

                    <h3 className="mt-5 text-lg font-semibold text-[#1D1617]">
                        No workouts found
                    </h3>
                    <p className="mt-2 text-sm text-[#ADA4A5]">
                        Try another filter or log your first workout.
                    </p>
                </Card>
            )}

            {/* Workout cards */}
            {!loading && !error && filtered.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2">
                    {filtered.map((w, index) => {
                        const isFeatured = index % 3 === 0;

                        return (
                            <Card
                                key={w.id}
                                className={`overflow-hidden rounded-[28px] border-0 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(29,22,23,0.08)] ${isFeatured
                                    ? "bg-[linear-gradient(135deg,#DA8FFF_0%,#9B5FFF_100%)] text-white shadow-[0_12px_28px_rgba(123,97,255,0.18)]"
                                    : "bg-white shadow-[0_8px_24px_rgba(29,22,23,0.05)]"
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <p
                                            className={`text-xs font-medium ${isFeatured ? "text-white/70" : "text-[#ADA4A5]"
                                                }`}
                                        >
                                            {w.userName}
                                        </p>

                                        <h3
                                            className={`mt-1 text-lg font-semibold leading-snug ${isFeatured ? "text-white" : "text-[#1D1617]"
                                                }`}
                                        >
                                            {w.name}
                                        </h3>
                                    </div>

                                    <div className="shrink-0">
                                        <Badge color={typeColor[w.type]}>{w.type}</Badge>
                                    </div>
                                </div>

                                <div className="mt-5 grid grid-cols-2 gap-3">
                                    <div
                                        className={`rounded-[18px] px-4 py-3 ${isFeatured ? "bg-white/18" : "bg-[#F7F8F8]"
                                            }`}
                                    >
                                        <p
                                            className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${isFeatured ? "text-white/70" : "text-[#ADA4A5]"
                                                }`}
                                        >
                                            Duration
                                        </p>
                                        <p
                                            className={`mt-2 text-sm font-semibold ${isFeatured ? "text-white" : "text-[#1D1617]"
                                                }`}
                                        >
                                            {w.duration}
                                        </p>
                                    </div>

                                    <div
                                        className={`rounded-[18px] px-4 py-3 ${isFeatured ? "bg-white/18" : "bg-[#F7F8F8]"
                                            }`}
                                    >
                                        <p
                                            className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${isFeatured ? "text-white/70" : "text-[#ADA4A5]"
                                                }`}
                                        >
                                            Calories
                                        </p>
                                        <p
                                            className={`mt-2 text-sm font-semibold ${isFeatured ? "text-white" : "text-[#1D1617]"
                                                }`}
                                        >
                                            {w.cal} kcal
                                        </p>
                                    </div>
                                </div>

                                {w.notes && (
                                    <div
                                        className={`mt-4 rounded-[18px] px-4 py-3 ${isFeatured ? "bg-white/14" : "bg-[#F3E6FA]"
                                            }`}
                                    >
                                        <p
                                            className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${isFeatured ? "text-white/70" : "text-[#ADA4A5]"
                                                }`}
                                        >
                                            Notes
                                        </p>
                                        <p
                                            className={`mt-2 line-clamp-2 text-sm ${isFeatured ? "text-white/90" : "text-[#7B6F72]"
                                                }`}
                                        >
                                            {w.notes}
                                        </p>
                                    </div>
                                )}

                                <div className="mt-5 flex items-center justify-between">
                                    <span
                                        className={`text-xs font-medium ${isFeatured ? "text-white/75" : "text-[#ADA4A5]"
                                            }`}
                                    >
                                        {w.displayDate || "Recent"}
                                    </span>

                                    <button
                                        className={`rounded-full px-4 py-2 text-xs font-semibold transition ${isFeatured
                                            ? "bg-white text-[#7B61FF]"
                                            : "bg-[linear-gradient(135deg,#7B61FF_0%,#A678F7_100%)] text-white shadow-[0_8px_18px_rgba(123,97,255,0.18)]"
                                            }`}
                                    >
                                        View Details
                                    </button>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}