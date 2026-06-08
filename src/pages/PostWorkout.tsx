import { revalidateLogic, useForm } from "@tanstack/react-form";
import Button from "../components/Button";
import { useEffect, useState } from "react";
import { fetchActivities, postWorkout, type Activity } from "../api/db";
import CalorieCard, { calculateBurnedCalories } from "../components/CalorieCard";

type WorkoutFormValues = {
    exerciseName: string;
    exerciseLengthMins: number;
    activityId: string;
    notes: string;
};

type FieldInfoProps = {
    field: {
        state: {
            meta: {
                isValidating: boolean;
                isTouched: boolean;
                isValid: boolean;
                errors: any[];
            };
        };
    };
};

const inputClass =
    "w-full rounded-full border border-transparent bg-[#F7F8F8] px-4 py-3 text-sm font-medium text-[#1D1617] placeholder:text-[#ADA4A5] outline-none transition focus:border-[#7B61FF] focus:bg-white focus:ring-4 focus:ring-[rgba(123,97,255,0.10)]";

const textareaClass =
    "w-full rounded-[20px] border border-transparent bg-[#F7F8F8] px-4 py-3 text-sm font-medium text-[#1D1617] placeholder:text-[#ADA4A5] outline-none transition focus:border-[#7B61FF] focus:bg-white focus:ring-4 focus:ring-[rgba(123,97,255,0.10)] resize-none";

const labelClass =
    "mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#ADA4A5]";

export function FieldInfo({ field }: FieldInfoProps) {
    const { isTouched, isValid, isValidating, errors } = field.state.meta;

    return (
        <>
            {isTouched && !isValid && (
                <em className="mt-2 block not-italic text-xs font-medium text-[#FF6B9D]">
                    {errors.join(", ")}
                </em>
            )}
            {isValidating && (
                <span className="mt-2 block text-xs text-[#ADA4A5]">Validating...</span>
            )}
        </>
    );
}

export default function PostWorkout() {
    const [activityList, setActivityList] = useState<Activity[]>([]);
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

    useEffect(() => {
        fetchActivities().then(setActivityList);
    }, []);

    const form = useForm<WorkoutFormValues>({
        defaultValues: {
            activityId: "",
            exerciseName: "",
            exerciseLengthMins: 0,
            notes: "",
        },
        validationLogic: revalidateLogic(),
        validators: {
            onDynamic: ({ value }) => {
                if (!selectedActivity) {
                    return { activityId: "Please select an activity" };
                }

                if (value.exerciseLengthMins < 10) {
                    return { exerciseLengthMins: "Must be at least 10 minutes" };
                }

                return undefined;
            },
        },
        onSubmit: async ({ value }) => {
            const weight = 90;
            const exerciseLength = value.exerciseLengthMins;
            const caloriesBurned = calculateBurnedCalories(
                selectedActivity?.MET,
                weight,
                exerciseLength
            );

            const payload = {
                calories_burned: caloriesBurned,
                user_name: "John Doe ",
                weight,
                workout_id: selectedActivity?.id,
                workout_length: exerciseLength / 60,
                timestamp: Date.now().toString(),
                notes: value.notes,
            };

            const result = await postWorkout(payload);
            alert(result.message);
            console.log(result);
        },
    });

    return (
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[32px] bg-white shadow-[0_18px_50px_rgba(29,22,23,0.08)]">
            {/* Hero */}
            <section className="relative overflow-hidden bg-[linear-gradient(135deg,#DA8FFF_0%,#9B5FFF_100%)] px-6 pb-28 pt-8 text-white sm:px-8">
                <div className="relative z-10 max-w-xl">
                    <p className="text-sm font-medium text-white/75">Workout Tracker</p>
                    <h1 className="mt-2 text-[34px] font-bold leading-none tracking-[-0.03em]">
                        Log Workout
                    </h1>
                    <p className="mt-3 text-sm text-white/80">
                        Track your activity and instantly estimate how many calories you burned.
                    </p>
                </div>

                <div className="pointer-events-none absolute inset-x-0 bottom-8 px-6 sm:px-8">
                    <div className="rounded-[24px] bg-white/18 p-4 backdrop-blur-sm">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-sm font-semibold text-white">
                                    Daily Workout Schedule
                                </p>
                                <p className="mt-1 text-xs text-white/70">
                                    Add a new session to your training log
                                </p>
                            </div>

                            <div className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-[#7B61FF]">
                                Check
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute -left-8 bottom-2 h-28 w-28 rounded-full bg-white/10" />
                <div className="absolute right-10 top-10 h-20 w-20 rounded-full bg-white/10" />
                <div className="absolute right-1/4 bottom-20 h-3 w-3 rounded-full bg-white/20" />
            </section>

            {/* Main sheet */}
            <section className="-mt-10 rounded-t-[32px] bg-[#FFFEFF] px-6 pb-8 pt-6 sm:px-8">
                <div className="mx-auto mb-6 h-1.5 w-20 rounded-full bg-[#E9E2EC]" />

                <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    {/* Form */}
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#1D1617]">
                                Workout Details
                            </h2>
                            <p className="mt-1 text-sm text-[#ADA4A5]">
                                Choose the activity, enter duration, and add a quick note.
                            </p>
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                form.handleSubmit();
                            }}
                            className="space-y-5"
                        >
                            <form.Field name="activityId">
                                {(field) => (
                                    <div>
                                        <label htmlFor={field.name} className={labelClass}>
                                            Activity
                                        </label>
                                        <select
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => {
                                                field.handleChange(e.target.value);
                                                const activity = activityList.find(
                                                    (a) => a.id === e.target.value
                                                );
                                                setSelectedActivity(activity ?? null);
                                            }}
                                            className={inputClass}
                                        >
                                            <option value="">Select an activity…</option>
                                            {activityList.map((activity) => (
                                                <option key={activity.id} value={activity.id}>
                                                    {activity.ActivityDesc}
                                                </option>
                                            ))}
                                        </select>
                                        <FieldInfo field={field} />
                                    </div>
                                )}
                            </form.Field>

                            <form.Field
                                name="exerciseLengthMins"
                                validators={{
                                    onChange: ({ value }) =>
                                        value < 10 ? "Minimum 10 minutes" : undefined,
                                }}
                            >
                                {(field) => (
                                    <div>
                                        <label htmlFor={field.name} className={labelClass}>
                                            Duration
                                        </label>
                                        <input
                                            id={field.name}
                                            name={field.name}
                                            type="number"
                                            min={1}
                                            value={field.state.value || ""}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                                            placeholder="e.g. 45"
                                            className={inputClass}
                                        />
                                        <FieldInfo field={field} />
                                    </div>
                                )}
                            </form.Field>

                            <form.Field name="notes">
                                {(field) => (
                                    <div>
                                        <label htmlFor={field.name} className={labelClass}>
                                            Notes
                                        </label>
                                        <textarea
                                            id={field.name}
                                            name={field.name}
                                            rows={4}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            placeholder="How did it feel?"
                                            className={textareaClass}
                                        />
                                    </div>
                                )}
                            </form.Field>

                            <form.Subscribe
                                selector={(state) => [state.canSubmit, state.isSubmitting] as const}
                            >
                                {([canSubmit, isSubmitting]) => (
                                    <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                                        <Button
                                            type="reset"
                                            variant="secondary"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                form.reset();
                                                setSelectedActivity(null);
                                            }}
                                            className="sm:min-w-[150px]"
                                        >
                                            Reset
                                        </Button>

                                        <button
                                            type="submit"
                                            disabled={!canSubmit || isSubmitting}
                                            className="inline-flex flex-1 items-center justify-center rounded-full bg-[linear-gradient(135deg,#7B61FF_0%,#A678F7_100%)] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(123,97,255,0.22)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {isSubmitting ? "Saving…" : "Save Workout"}
                                        </button>
                                    </div>
                                )}
                            </form.Subscribe>
                        </form>
                    </div>

                    {/* Right column */}
                    <div className="space-y-5">
                        <div className="rounded-[28px] bg-[#F3E6FA] p-5">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h3 className="text-lg font-semibold text-[#1D1617]">
                                        Upcoming Workout
                                    </h3>
                                    <p className="mt-1 text-sm text-[#ADA4A5]">
                                        Preview of the currently selected training session
                                    </p>
                                </div>

                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-xl shadow-[0_8px_20px_rgba(29,22,23,0.06)]">
                                    💪
                                </div>
                            </div>

                            <div className="mt-5 rounded-[22px] bg-white px-5 py-5 shadow-[0_8px_20px_rgba(29,22,23,0.05)]">
                                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#ADA4A5]">
                                    Selected
                                </p>
                                <p className="mt-2 text-lg font-semibold text-[#1D1617]">
                                    {selectedActivity?.ActivityDesc || "No activity selected"}
                                </p>

                                <div className="mt-4 grid grid-cols-2 gap-3">
                                    <div className="rounded-[18px] bg-[#DDF8EE] px-4 py-3">
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7B6F72]">
                                            MET
                                        </p>
                                        <p className="mt-2 text-sm font-semibold text-[#00B67A]">
                                            {selectedActivity?.MET ?? "—"}
                                        </p>
                                    </div>

                                    <div className="rounded-[18px] bg-[#EEE9FF] px-4 py-3">
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7B6F72]">
                                            Category
                                        </p>
                                        <p className="mt-2 text-sm font-semibold text-[#7B61FF]">
                                            {selectedActivity?.Main || "—"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <form.Subscribe selector={(s) => s.values.exerciseLengthMins}>
                            {(mins) => (
                                <div className="[&>*]:!mt-0">
                                    <CalorieCard
                                        activity={selectedActivity}
                                        durationMins={mins}
                                    />
                                </div>
                            )}
                        </form.Subscribe>
                    </div>
                </div>
            </section>
        </div>
    );
}