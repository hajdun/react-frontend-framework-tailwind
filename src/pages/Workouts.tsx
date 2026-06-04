import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'
import Badge from '../components/Badge'

import { fetchActivities, fetchWorkouts, type Activity, type Workout } from '../api/db'

const typeColor = {
    Cardio: 'teal',
    Strength: 'orange',
    Flexibility: 'green',
} as const

const FILTERS = ['All', 'Strength', 'Cardio', 'Flexibility'] as const

type WorkoutType = keyof typeof typeColor

type WorkoutCardItem = {
    id: string
    name: string
    type: WorkoutType
    duration: string
    cal: number
    exercises: number
    notes?: string
    timestamp?: string
    userName: string
}

function formatDuration(hours: number) {
    const mins = Math.round(hours * 60)
    return `${mins} min`
}

function inferType(main?: string): WorkoutType {
    const value = (main || '').toLowerCase()

    if (
        value.includes('running') ||
        value.includes('bicycling') ||
        value.includes('walking') ||
        value.includes('cardio') ||
        value.includes('conditioning')
    ) {
        return 'Cardio'
    }

    if (
        value.includes('stretching') ||
        value.includes('yoga') ||
        value.includes('flexibility')
    ) {
        return 'Flexibility'
    }

    return 'Strength'
}

export default function Workouts() {
    const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All')
    const [activities, setActivities] = useState<Activity[]>([])
    const [workouts, setWorkouts] = useState<Workout[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true)
                setError('')

                const [activityData, workoutData] = await Promise.all([
                    fetchActivities(),
                    fetchWorkouts(),
                ])

                setActivities(activityData)
                setWorkouts(workoutData)
            } catch (err) {
                console.error(err)
                setError('Failed to load workouts.')
            } finally {
                setLoading(false)
            }
        }

        load()
    }, [])

    const workoutCards = useMemo<WorkoutCardItem[]>(() => {
        const activityMap = new Map(activities.map((a) => [a.id, a]))

        return workouts.map((workout, index) => {
            const activity = activityMap.get(workout.workout_id)

            const type = inferType(activity?.Main)
            const name =
                activity?.ActivityDesc ||
                activity?.Main ||
                `Workout ${index + 1}`

            return {
                id: workout.timestamp || `${workout.workout_id}-${index}`,
                name,
                type,
                duration: formatDuration(workout.workout_length),
                cal: Math.round(workout.calories_burned),
                exercises: 1,
                notes: "It was:" + workout.notes,
                timestamp: workout.timestamp,
                userName: workout.user_name,
            }
        })
    }, [activities, workouts])

    const filtered =
        filter === 'All'
            ? workoutCards
            : workoutCards.filter((w) => w.type === filter)

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-text">Workouts</h1>
                    <p className="text-sm text-muted mt-0.5">
                        {workoutCards.length} workouts logged
                    </p>
                </div>

                <Button size="sm" variant="primary">
                    <Link to="/post_workout">+ Log Workout</Link>
                </Button>
            </div>

            <div className="flex gap-1.5 flex-wrap">
                {FILTERS.map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f
                            ? 'bg-[var(--color-primary)]'
                            : 'bg-[var(--color-surface-offset)] text-muted hover:text-text'
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {loading && (
                <div className="grid gap-3 md:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <div className="h-4 w-32 rounded bg-[var(--color-surface-offset)] mb-3" />
                            <div className="h-3 w-48 rounded bg-[var(--color-surface-offset)]" />
                        </Card>
                    ))}
                </div>
            )}

            {!loading && error && (
                <Card>
                    <p className="text-sm text-[var(--color-error)]">{error}</p>
                </Card>
            )}

            {!loading && !error && filtered.length === 0 && (
                <Card>
                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-text">No workouts found</h3>
                        <p className="text-sm text-muted">
                            Try another filter or log your first workout.
                        </p>
                    </div>
                </Card>
            )}

            {!loading && !error && filtered.length > 0 && (
                <div className="grid gap-3 md:grid-cols-2">
                    {filtered.map((w) => (
                        <Card
                            key={w.id}
                            className="hover:shadow-[var(--shadow-md)] transition-shadow cursor-pointer"
                        >
                            <div className="flex items-start justify-between mb-2 gap-3">
                                <div>
                                    <h3 className="text-sm font-semibold text-text">{w.name}</h3>
                                    <p className="text-xs text-muted mt-0.5">{w.userName}</p>
                                </div>
                                <Badge color={typeColor[w.type]}>{w.type}</Badge>
                            </div>

                            <div className="flex gap-4 text-xs text-muted flex-wrap">
                                <span>⏱ {w.duration}</span>
                                <span>🔥 {w.cal} kcal</span>

                            </div>

                            {w.notes && (
                                <p className="text-xs text-muted mt-3 line-clamp-2">{w.notes}</p>
                            )}
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}