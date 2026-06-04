import { useEffect, useMemo, useRef, useState } from 'react'

export const FAVORITE_WORKOUT_OPTIONS = [
    'Bench Press',
    'Squat',
    'Deadlift',
    'Pull Up',
    'Overhead Press',
    'Barbell Row',
    'Running',
    'Cycling',
    'Yoga',
] as const


export type FavoriteWorkout = (typeof FAVORITE_WORKOUT_OPTIONS)[number]

type FavoriteWorkoutsFieldProps = {
    field: {
        state: {
            value: FavoriteWorkout[]
            meta: {
                isValidating: boolean
                isTouched: boolean
                isValid: boolean
                errors: any[]
            }
        }
        handleChange: (value: FavoriteWorkout[]) => void
        handleBlur: () => void
    }
}

export default function FavoriteWorkoutsField({
    field
}: FavoriteWorkoutsFieldProps) {


    const [query, setQuery] = useState('')
    const [open, setOpen] = useState(false)
    const wrapperRef = useRef<HTMLDivElement>(null)

    const filteredOptions = useMemo(() => {
        const q = query.trim().toLowerCase()

        return FAVORITE_WORKOUT_OPTIONS.filter((option) => {
            const notSelected = !field.state.value.includes(option)
            const matches = option.toLowerCase().includes(q)
            return notSelected && matches
        })
    }, [query, field.state.value])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const addWorkout = (workout: FavoriteWorkout) => {
        field.handleChange([...field.state.value, workout])
        setQuery('')
        setOpen(true)
    }

    const removeWorkout = (workout: FavoriteWorkout) => {
        field.handleChange(field.state.value.filter((item) => item !== workout))
    }

    return (
        <div>
            <label className="">Favorite Workouts</label>

            <div ref={wrapperRef} className="relative">
                <div
                    className="flex min-h-[46px] bg-white flex-wrap items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary)]/40"
                    onClick={() => setOpen(true)}
                >
                    {field.state.value.map((workout) => (
                        <span
                            key={workout}
                            className="inline-flex bg-white  items-center gap-1 rounded-full bg-[oklch(from_var(--color-primary)_l_c_h_/_0.12)] px-2.5 py-1 text-xs font-medium text-[var(--color-primary)]"
                        >
                            {workout}
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    removeWorkout(workout)
                                }}
                                className="bg-white  rounded-full p-0.5 hover:bg-[oklch(from_var(--color-primary)_l_c_h_/_0.12)]"
                                aria-label={`Remove ${workout}`}
                            >
                                ×
                            </button>
                        </span>
                    ))}

                    <input
                        value={query}
                        onBlur={field.handleBlur}
                        onFocus={() => setOpen(true)}
                        onChange={(e) => {
                            setQuery(e.target.value)
                            setOpen(true)
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Backspace' && !query && field.state.value.length > 0) {
                                removeWorkout(field.state.value[field.state.value.length - 1])
                            }

                            if (e.key === 'Enter') {
                                e.preventDefault()
                                if (filteredOptions.length > 0) {
                                    addWorkout(filteredOptions[0])
                                }
                            }

                            if (e.key === 'Escape') {
                                setOpen(false)
                            }
                        }}
                        placeholder={
                            field.state.value.length === 0
                                ? 'Search and select workouts...'
                                : ''
                        }
                        className="min-w-[140px] flex-1 bg-transparent text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] outline-none"
                    />
                </div>

                {open && filteredOptions.length > 0 && (
                    <div className="absolute bg-white   left-0 right-0 top-[calc(100%+6px)] z-20 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] shadow-md">
                        <ul className="max-h-56 overflow-y-auto py-1">
                            {filteredOptions.map((option) => (
                                <li key={option} className='hover:bg-gray-200'>
                                    <button
                                        type="button"
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => addWorkout(option)}
                                        className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-[var(--color-text)] hover:bg-[var(--color-surface-offset)]"
                                    >
                                        <span>{option}</span>
                                        <span className="text-xs text-[var(--color-text-muted)]">Add</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                Type to search, press Enter to add, Backspace to remove the last pill.
            </p>


        </div >
    )

    // put the custom select code here
}