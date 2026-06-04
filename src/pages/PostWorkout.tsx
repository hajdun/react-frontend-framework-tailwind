import { revalidateLogic, useForm } from '@tanstack/react-form'
import Button from '../components/Button'
import { useEffect, useState } from 'react'
import { fetchActivities, postWorkout, type Activity } from '../api/db'
import CalorieCard, { calculateBurnedCalories } from '../components/CalorieCard'

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



// --- Form ---

export default function PostWorkout() {
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
                if (!selectedActivity) return { exerciseName: 'Exercise name is required' }
                if (value.exerciseLengthMins < 10) return { exerciseLengthMins: 'Must be at least 10 minutes' }
                return undefined
            },
        },
        onSubmit: async ({ value }) => {
            console.log(value)
            const weight = 90
            const exerciseLength = value.exerciseLengthMins
            const caloriesBurned = calculateBurnedCalories(selectedActivity?.MET, weight, exerciseLength)

            const payload = {
                calories_burned: caloriesBurned,
                user_name: "John Doe ",
                weight: weight,
                workout_id: selectedActivity?.id,
                workout_length: exerciseLength / 60,
                timestamp: (Date.now()).toString(),
                notes: value.notes
            }

            const result = await postWorkout(payload)
            alert(result.message)
            console.log(result)
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
                                    placeholder="How did it feel?"
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
                            <div className="flex gap-3 pt-1 justify-between">
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

                                <Button
                                    type="submit"
                                    variant="secondary"
                                >
                                    {isSubmitting ? 'Saving…' : 'Save Workout'}
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