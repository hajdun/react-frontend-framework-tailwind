import Card from '../components/Card.jsx'
import StatCard from '../components/StatCard.jsx'

const WEIGHT_DATA = [69.8, 69.5, 69.2, 68.9, 68.7, 68.5, 68.2]
const LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MIN = Math.min(...WEIGHT_DATA) - 0.5
const MAX = Math.max(...WEIGHT_DATA) + 0.5

function toY(val, h) {
    return h - ((val - MIN) / (MAX - MIN)) * h
}

export default function Progress() {
    const W = 500, H = 100

    const points = WEIGHT_DATA.map((v, i) =>
        `${(i / (WEIGHT_DATA.length - 1)) * W},${toY(v, H)}`
    ).join(' ')

    return (
        <div className="space-y-5">
            <div>
                <h1 className="text-xl font-semibold text-text">Progress</h1>
                <p className="text-sm text-muted mt-0.5">Your stats over time</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <StatCard label="Current Weight" value="68.2" unit="kg" delta={-1.6} deltaLabel="this month" />
                <StatCard label="Body Fat" value="18.4" unit="%" delta={-0.8} deltaLabel="this month" />
                <StatCard label="Workouts" value="14" unit="this month" delta={3} deltaLabel="vs last" />
            </div>

            <Card>
                <h2 className="text-sm font-semibold text-text mb-4">Weight This Week</h2>
                <svg viewBox={`0 0 ${W} ${H + 20}`} className="w-full" preserveAspectRatio="none">
                    {/* area fill */}
                    <defs>
                        <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.15" />
                            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <polygon
                        points={`0,${H} ${points} ${W},${H}`}
                        fill="url(#wg)"
                    />
                    <polyline
                        points={points}
                        fill="none"
                        stroke="var(--color-primary)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {WEIGHT_DATA.map((v, i) => (
                        <g key={i}>
                            <circle
                                cx={(i / (WEIGHT_DATA.length - 1)) * W}
                                cy={toY(v, H)}
                                r="3"
                                fill="var(--color-primary)"
                            />
                            <text
                                x={(i / (WEIGHT_DATA.length - 1)) * W}
                                y={H + 16}
                                textAnchor="middle"
                                fontSize="10"
                                fill="var(--color-text-muted)"
                            >{LABELS[i]}</text>
                        </g>
                    ))}
                </svg>
            </Card>

            <Card>
                <h2 className="text-sm font-semibold text-text mb-3">Personal Records</h2>
                <div className="space-y-0">
                    {[
                        { name: 'Bench Press', record: '85 kg', date: '2 weeks ago' },
                        { name: 'Squat', record: '110 kg', date: '1 month ago' },
                        { name: 'Deadlift', record: '130 kg', date: '3 weeks ago' },
                        { name: '5K Run', record: '24:15', date: 'Last week' },
                    ].map(({ name, record, date }) => (
                        <div key={name} className="flex items-center justify-between py-3 border-b border-[var(--color-divider)] last:border-0">
                            <p className="text-sm text-text">{name}</p>
                            <div className="text-right">
                                <p className="text-sm font-semibold text-primary tabular-nums">{record}</p>
                                <p className="text-[11px] text-faint">{date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    )
}