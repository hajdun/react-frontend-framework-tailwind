
import { revalidateLogic, useForm } from '@tanstack/react-form'
import type { AnyFieldApi } from '@tanstack/react-form'
import Button from '../components/Button'
import type { FavoriteWorkout } from '../components/FavoriteWorkoutsField'
import FavoriteWorkoutsField from '../components/FavoriteWorkoutsField'


type LiftingPreference =
    | 'powerlifting'
    | 'bodybuilding'
    | 'general-fitness'
    | 'olympic-lifting'



type ProfileFormValues = {
    name: string
    age: number
    bodyWeight: number
    preferredLiftWeight: number
    liftingPreference: LiftingPreference
    favoriteWorkouts: FavoriteWorkout[]
}

function FieldInfo({ field }: { field: Pick<AnyFieldApi, 'state'> }) {
    const { isTouched, isValid, isValidating, errors } = field.state.meta

    return (
        <>
            {isTouched && !isValid && (
                <p className="mt-1 text-xs text-[var(--color-error)]">
                    {errors.join(', ')}
                </p>
            )}
            {isValidating && (
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                    Validating...
                </p>
            )}
        </>
    )
}

const inputClass =
    'w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)] transition'

const labelClass =
    'mb-1 block text-sm font-medium text-[var(--color-text)]'

export default function Settings() {
    const form = useForm<ProfileFormValues>({
        defaultValues: {
            name: '',
            age: 18,
            bodyWeight: 70,
            preferredLiftWeight: 40,
            liftingPreference: 'general-fitness',
            favoriteWorkouts: [],
        },
        validationLogic: revalidateLogic(),
        validators: {
            onDynamic: ({ value }) => {
                const errors: Partial<Record<keyof ProfileFormValues, string>> = {}

                if (!value.name.trim()) {
                    errors.name = 'Name is required'
                }

                if (!value.age || value.age < 10) {
                    errors.age = 'Age must be at least 10'
                }

                if (!value.bodyWeight || value.bodyWeight <= 0) {
                    errors.bodyWeight = 'Body weight must be greater than 0'
                }

                if (!value.preferredLiftWeight || value.preferredLiftWeight <= 0) {
                    errors.preferredLiftWeight = 'Lifted weight must be greater than 0'
                }

                // cross validation
                if (
                    value.bodyWeight > 0 &&
                    value.preferredLiftWeight > 0 &&
                    value.preferredLiftWeight > value.bodyWeight
                ) {
                    errors.bodyWeight = 'Body weight must be at least as high as lifted weight'
                    errors.preferredLiftWeight = 'Lifted weight cannot exceed body weight'
                }

                if (value.favoriteWorkouts.length === 0) {
                    errors.favoriteWorkouts = 'Select at least one favorite workout'
                }

                return Object.keys(errors).length ? errors : undefined
            },
        },
        onSubmit: async ({ value }) => {
            console.log('Profile settings:', value)
        },
    })

    return (
        <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">
            <div>
                <h1 className="text-xl font-semibold text-text">Profile Settings</h1>
                <p className="mt-1 text-sm text-muted">
                    Update your details, lifting preferences, and favorite workouts.
                </p>
            </div>

            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-6 shadow-sm">
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        void form.handleSubmit()
                    }}
                    className="space-y-5"
                >
                    <div className="grid gap-5 md:grid-cols-2">
                        <form.Field name="name">
                            {(field) => (
                                <div>
                                    <label htmlFor={field.name} className={labelClass}>
                                        Name
                                    </label>
                                    <input
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder="John Doe"
                                        className={inputClass}
                                    />
                                    <FieldInfo field={field} />
                                </div>
                            )}
                        </form.Field>

                        <form.Field name="age">
                            {(field) => (
                                <div>
                                    <label htmlFor={field.name} className={labelClass}>
                                        Age
                                    </label>
                                    <input
                                        id={field.name}
                                        name={field.name}
                                        type="number"
                                        min={10}
                                        value={field.state.value || ''}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                                        className={inputClass}
                                    />
                                    <FieldInfo field={field} />
                                </div>
                            )}
                        </form.Field>

                        <form.Field name="bodyWeight">
                            {(field) => (
                                <div>
                                    <label htmlFor={field.name} className={labelClass}>
                                        Body Weight (kg)
                                    </label>
                                    <input
                                        id={field.name}
                                        name={field.name}
                                        type="number"
                                        min={1}
                                        step={0.1}
                                        value={field.state.value || ''}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                                        className={inputClass}
                                    />
                                    <FieldInfo field={field} />
                                </div>
                            )}
                        </form.Field>

                        <form.Field name="preferredLiftWeight">
                            {(field) => (
                                <div>
                                    <label htmlFor={field.name} className={labelClass}>
                                        Weight Lifted (kg)
                                    </label>
                                    <input
                                        id={field.name}
                                        name={field.name}
                                        type="number"
                                        min={1}
                                        step={0.1}
                                        value={field.state.value || ''}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                                        className={inputClass}
                                    />
                                    <FieldInfo field={field} />
                                </div>
                            )}
                        </form.Field>
                    </div>

                    <form.Field name="liftingPreference">
                        {(field) => (
                            <div>
                                <label htmlFor={field.name} className={labelClass}>
                                    Lifting Preference
                                </label>
                                <select
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value as LiftingPreference)
                                    }
                                    className={inputClass}
                                >
                                    <option value="general-fitness">General Fitness</option>
                                    <option value="bodybuilding">Bodybuilding</option>
                                    <option value="powerlifting">Powerlifting</option>
                                    <option value="olympic-lifting">Olympic Lifting</option>
                                </select>
                                <FieldInfo field={field} />
                            </div>
                        )}
                    </form.Field>

                    <form.Field name="favoriteWorkouts">
                        {(field) => <FavoriteWorkoutsField field={field} form={form} />}
                    </form.Field>

                    <form.Subscribe
                        selector={(state) => [state.canSubmit, state.isSubmitting, state.values] as const}
                    >
                        {([canSubmit, isSubmitting, values]) => {
                            const invalidWeightRelation =
                                values.preferredLiftWeight > values.bodyWeight

                            return (
                                <div className="space-y-4">
                                    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                                        <p className="text-xs uppercase tracking-wide text-muted">
                                            Live preview
                                        </p>

                                        <div className="mt-2 grid gap-2 text-sm text-text sm:grid-cols-2">
                                            <p><span className="text-muted">Name:</span> {values.name || '—'}</p>
                                            <p><span className="text-muted">Age:</span> {values.age || '—'}</p>
                                            <p><span className="text-muted">Body weight:</span> {values.bodyWeight || '—'} kg</p>
                                            <p><span className="text-muted">Weight lifted:</span> {values.preferredLiftWeight || '—'} kg</p>
                                            <p><span className="text-muted">Preference:</span> {values.liftingPreference}</p>
                                            <p className="sm:col-span-2">
                                                <span className="text-muted">Favorites:</span>{' '}
                                                {values.favoriteWorkouts.length
                                                    ? values.favoriteWorkouts.join(', ')
                                                    : '—'}
                                            </p>
                                        </div>

                                        {invalidWeightRelation && (
                                            <p className="mt-3 text-sm text-[var(--color-error)]">
                                                Weight lifted cannot be higher than body weight.
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex gap-3">
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            disabled={!canSubmit || isSubmitting}
                                            className="flex-1"
                                        >
                                            {isSubmitting ? 'Saving...' : 'Save Settings'}
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={() => form.reset()}
                                        >
                                            Reset
                                        </Button>
                                    </div>
                                </div>
                            )
                        }}
                    </form.Subscribe>
                </form>
            </div>
        </div>
    )
}