import StatCard from '../components/StatCard.jsx'
import Card from '../components/Card.jsx'
import Badge from '../components/Badge.jsx'

const RECENT = [
    { name: 'Morning Run', type: 'Cardio', duration: '32 min', cal: 310, date: 'Today' },
    { name: 'Push Day', type: 'Strength', duration: '48 min', cal: 280, date: 'Yesterday' },
    { name: 'Yoga Flow', type: 'Flexibility', duration: '25 min', cal: 120, date: 'Mon' },
]

const typeColor = { Cardio: 'teal', Strength: 'orange', Flexibility: 'green' }

export default function Dashboard() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl font-semibold text-text">Dashboard</h1>
                <p className="text-sm text-muted mt-0.5">Good morning, Jane. You're on a 5-day streak 🔥</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard label="Calories" value="1,840" unit="kcal" delta={120} deltaLabel="vs avg" />
                <StatCard label="Workouts" value="14" unit="this month" delta={3} deltaLabel="vs last" />
                <StatCard label="Active mins" value="47" unit="min today" delta={-8} deltaLabel="vs goal" />
                <StatCard label="Weight" value="68.2" unit="kg" delta={-0.4} deltaLabel="this week" />
            </div>

            <Card>
                <h2 className="text-sm font-semibold text-text mb-4">Recent Workouts</h2>
                <div className="space-y-2">
                    {RECENT.map((w) => (
                        <div key={w.name} className="flex items-center justify-between py-2 border-b border-[var(--color-divider)] last:border-0">
                            <div className="flex items-center gap-3">
                                <Badge color={typeColor[w.type]}>{w.type}</Badge>
                                <div>
                                    <p className="text-sm font-medium text-text">{w.name}</p>
                                    <p className="text-xs text-muted">{w.duration} · {w.cal} kcal</p>
                                </div>
                            </div>
                            <span className="text-xs text-faint">{w.date}</span>
                        </div>
                    ))}
                </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-3">
                <Card>
                    <h2 className="text-sm font-semibold text-text mb-3">Weekly Goal</h2>
                    <div className="space-y-3">
                        {[
                            { label: 'Workouts', done: 4, goal: 5 },
                            { label: 'Cardio mins', done: 95, goal: 150 },
                            { label: 'Calories burned', done: 1200, goal: 2000 },
                        ].map(({ label, done, goal }) => (
                            <div key={label}>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-muted">{label}</span>
                                    <span className="text-text font-medium">{done} / {goal}</span>
                                </div>
                                <div className="h-1.5 bg-[var(--color-surface-offset)] rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary rounded-full transition-all"
                                        style={{ width: `${Math.min((done / goal) * 100, 100)}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card>
                    <h2 className="text-sm font-semibold text-text mb-3">This Week</h2>
                    <div className="flex items-end gap-1.5 h-20">
                        {[3, 5, 0, 4, 6, 2, 0].map((val, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                <div
                                    className="w-full rounded-sm bg-primary opacity-80 transition-all"
                                    style={{ height: `${(val / 6) * 100}%`, minHeight: val ? '4px' : '0' }}
                                />
                                <span className="text-[10px] text-faint">
                                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    )
}