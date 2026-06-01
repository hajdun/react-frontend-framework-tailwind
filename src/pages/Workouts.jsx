import { useState } from 'react'
import Card from '../components/Card.jsx'
import Button from '../components/Button.jsx'
import Badge from '../components/Badge.jsx'

const WORKOUTS = [
    { id: 1, name: 'Push Day', type: 'Strength', duration: '48 min', cal: 280, exercises: 6 },
    { id: 2, name: 'Morning Run 5K', type: 'Cardio', duration: '32 min', cal: 310, exercises: 1 },
    { id: 3, name: 'Yoga Flow', type: 'Flexibility', duration: '25 min', cal: 120, exercises: 12 },
    { id: 4, name: 'Pull Day', type: 'Strength', duration: '52 min', cal: 300, exercises: 7 },
    { id: 5, name: 'HIIT Blast', type: 'Cardio', duration: '20 min', cal: 260, exercises: 8 },
    { id: 6, name: 'Leg Day', type: 'Strength', duration: '55 min', cal: 320, exercises: 6 },
]

const typeColor = { Cardio: 'teal', Strength: 'orange', Flexibility: 'green' }
const FILTERS = ['All', 'Strength', 'Cardio', 'Flexibility']

export default function Workouts() {
    const [filter, setFilter] = useState('All')

    const filtered = filter === 'All' ? WORKOUTS : WORKOUTS.filter(w => w.type === filter)

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-text">Workouts</h1>
                    <p className="text-sm text-muted mt-0.5">{WORKOUTS.length} workouts logged</p>
                </div>
                <Button size="sm">+ Log Workout</Button>
            </div>

            <div className="flex gap-1.5 flex-wrap">
                {FILTERS.map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f
                            ? 'bg-primary text-white'
                            : 'bg-[var(--color-surface-offset)] text-muted hover:text-text'
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div className="grid gap-3 md:grid-cols-2">
                {filtered.map(w => (
                    <Card key={w.id} className="hover:shadow-[var(--shadow-md)] transition-shadow cursor-pointer">
                        <div className="flex items-start justify-between mb-2">
                            <h3 className="text-sm font-semibold text-text">{w.name}</h3>
                            <Badge color={typeColor[w.type]}>{w.type}</Badge>
                        </div>
                        <div className="flex gap-4 text-xs text-muted">
                            <span>⏱ {w.duration}</span>
                            <span>🔥 {w.cal} kcal</span>
                            <span>📋 {w.exercises} exercises</span>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}