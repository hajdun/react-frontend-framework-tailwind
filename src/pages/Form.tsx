import { revalidateLogic, useForm } from '@tanstack/react-form'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import Button from '../components/Button'
import { useEffect, useState } from 'react'
import { fetchActivities, type Activity } from '../api/db'

// --- Types ---

type WorkoutFormValues = {
    exerciseName: string
    exerciseLengthMins: number
    activityId: string
    notes: string
}

type FieldInfoProps = {
    field: {
        state: {
            meta: {
                isValidating: boolean
                isTouched: boolean
                isValid: boolean
                errors: any[]
            }
        }
    }
}

// --- Shared input classes ---

const inputClass =
    'w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] text-sm placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)] transition'

const labelClass = 'text-sm font-medium text-[var(--color-text)]'

// --- FieldInfo ---

export function FieldInfo({ field }: FieldInfoProps) {
    const { isTouched, isValid, isValidating, errors } = field.state.meta
    return (
        <>
            {isTouched && !isValid && (
                <em className="text-xs text-[var(--color-error)] mt-1 block not-italic">
                    {errors.join(', ')}
                </em>
            )}
            {isValidating && (
                <span className="text-xs text-[var(--color-text-muted)] mt-1 block">
                    Validating...
                </span>
            )}
        </>
    )
}

// --- Calorie Result Card ---

function CalorieCard({
    activity,
    durationMins,
    weightKg = 90,
}: {
    activity: Activity | null
    durationMins: number
    weightKg?: number
}) {
    if (!activity || !durationMins) {
        return (
            <div className="mt-6 rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-center">
                <div className="text-3xl mb-2">🔥</div>
                <p className="text-sm text-[var(--color-text-muted)]">
                    Select an activity and enter duration to see calories burned
                </p>
            </div>
        )
    }

    const hours = durationMins / 60
    const calories = Math.round(activity.MET * weightKg * hours)

    return (
        <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
            {/* Header */}
            <div className="bg-[var(--color-primary)] px-5 py-3 flex items-center gap-2">
                <span className="text-lg">🔥</span>
                <h2 className="text-sm font-semibold text-white">Calories Burned</h2>
            </div>

            {/* Big number */}
            <div className="px-5 py-4 flex items-end gap-1">
                <span className="text-4xl font-bold text-[var(--color-text)] tabular-nums">
                    {calories}
                </span>
                <span className="text-sm text-[var(--color-text-muted)] mb-1">kcal (   MET × Weight (kg) × Time (h))</span>
            </div>

            {/* Breakdown */}
            <div className="border-t border-[var(--color-border)] px-5 py-3 grid grid-cols-3 gap-3 text-center">
                {[
                    { label: 'MET', value: activity.MET },
                    { label: 'Weight', value: `${weightKg} kg` },
                    { label: 'Duration', value: `${hours.toFixed(2)} h` },
                ].map(({ label, value }) => (
                    <div key={label} className="flex flex-col">
                        <span className="text-xs text-[var(--color-text-muted)]">{label}</span>
                        <span className="text-sm font-semibold text-[var(--color-text)] tabular-nums">
                            {value}
                        </span>
                    </div>
                ))}
            </div>


        </div>
    )
}

// --- Form ---

export default function AddWorkoutForm() {
    const [activityList, setActivityList] = useState<Activity[]>([])
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)

    useEffect(() => {
        fetchActivities().then(setActivityList)
    }, [])

    const form = useForm<WorkoutFormValues>({
        defaultValues: {
            activityId: '',
            exerciseName: '',
            exerciseLengthMins: 0,
            notes: '',
        },
        validationLogic: revalidateLogic(),
        validators: {
            onDynamic: ({ value }) => {
                if (!value.exerciseName) return { exerciseName: 'Exercise name is required' }
                if (value.exerciseLengthMins < 10) return { exerciseLengthMins: 'Must be at least 10 minutes' }
                return undefined
            },
        },
        onSubmit: async ({ value }) => {
            await addDoc(collection(db, 'workouts'), {
                ...value,
                createdAt: serverTimestamp(),
            })
        },
    })

    return (
        <div className="max-w-lg mx-auto px-4 py-8">
            {/* Page header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[var(--color-text)]">Log Workout</h1>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">
                    Track your activity and see how many calories you burned
                </p>
            </div>

            {/* Card wrapper */}
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-6 shadow-sm">
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        form.handleSubmit()
                    }}
                    className="flex flex-col gap-5"
                >
                    {/* Activity select */}
                    <form.Field name="activityId">
                        {(field) => (
                            <div className="flex flex-col gap-1">
                                <label htmlFor={field.name} className={labelClass}>
                                    Activity
                                </label>
                                <select
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => {
                                        field.handleChange(e.target.value)
                                        const activity = activityList.find(
                                            (a) => a.id === e.target.value
                                        )
                                        setSelectedActivity(activity ?? null)
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

                    {/* Duration */}
                    <form.Field
                        name="exerciseLengthMins"
                        validators={{
                            onChange: ({ value }) =>
                                value < 10 ? 'Minimum 10 minutes' : undefined,
                        }}
                    >
                        {(field) => (
                            <div className="flex flex-col gap-1">
                                <label htmlFor={field.name} className={labelClass}>
                                    Duration
                                    <span className="text-[var(--color-text-muted)] font-normal ml-1">
                                        (minutes)
                                    </span>
                                </label>
                                <input
                                    id={field.name}
                                    name={field.name}
                                    type="number"
                                    min={1}
                                    value={field.state.value || ''}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                                    placeholder="e.g. 45"
                                    className={inputClass}
                                />
                                <FieldInfo field={field} />
                            </div>
                        )}
                    </form.Field>

                    {/* Notes */}
                    <form.Field name="notes">
                        {(field) => (
                            <div className="flex flex-col gap-1">
                                <label htmlFor={field.name} className={labelClass}>
                                    Notes
                                    <span className="text-[var(--color-text-muted)] font-normal ml-1">
                                        (optional)
                                    </span>
                                </label>
                                <textarea
                                    id={field.name}
                                    name={field.name}
                                    rows={3}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder="How did it feel? Any PRs?"
                                    className={`${inputClass} resize-none`}
                                />
                            </div>
                        )}
                    </form.Field>

                    {/* Actions */}
                    <form.Subscribe
                        selector={(state) => [state.canSubmit, state.isSubmitting] as const}
                    >
                        {([canSubmit, isSubmitting]) => (
                            <div className="flex gap-3 pt-1">
                                <Button
                                    type="submit"
                                    disabled={!canSubmit}
                                    className="flex-1"
                                >
                                    {isSubmitting ? 'Saving…' : 'Save Workout'}
                                </Button>
                                <Button
                                    type="reset"
                                    variant="secondary"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        form.reset()
                                        setSelectedActivity(null)
                                    }}
                                >
                                    Reset
                                </Button>
                            </div>
                        )}
                    </form.Subscribe>
                </form>
            </div>

            {/* Calorie card */}
            <form.Subscribe selector={(s) => s.values.exerciseLengthMins}>
                {(mins) => (
                    <CalorieCard
                        activity={selectedActivity}
                        durationMins={mins}
                    />
                )}
            </form.Subscribe>
        </div>
    )
}