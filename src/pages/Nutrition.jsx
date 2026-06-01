import { useState } from 'react'
import Card from '../components/Card.jsx'
import Button from '../components/Button.jsx'

const MEALS = [
    { name: 'Oatmeal with berries', time: '8:00', cal: 340, p: 12, c: 58, f: 8 },
    { name: 'Chicken & rice bowl', time: '12:30', cal: 520, p: 42, c: 55, f: 9 },
    { name: 'Greek yogurt', time: '15:00', cal: 130, p: 15, c: 10, f: 3 },
    { name: 'Salmon & veggies', time: '19:00', cal: 480, p: 38, c: 30, f: 18 },
]

const GOAL = 2000
const totalCal = MEALS.reduce((s, m) => s + m.cal, 0)
const totalP = MEALS.reduce((s, m) => s + m.p, 0)
const totalC = MEALS.reduce((s, m) => s + m.c, 0)
const totalF = MEALS.reduce((s, m) => s + m.f, 0)

export default function Nutrition() {
    const [meals] = useState(MEALS)

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-text">Nutrition</h1>
                    <p className="text-sm text-muted mt-0.5">Today's food log</p>
                </div>
                <Button size="sm">+ Add Meal</Button>
            </div>

            {/* Calorie ring summary */}
            <Card>
                <div className="flex items-center gap-6">
                    <div className="relative w-20 h-20 flex-shrink-0">
                        <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                            <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--color-surface-offset)" strokeWidth="3" />
                            <circle
                                cx="18" cy="18" r="15.9" fill="none"
                                stroke="var(--color-primary)" strokeWidth="3"
                                strokeDasharray={`${(totalCal / GOAL) * 100} 100`}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-sm font-bold text-text tabular-nums">{totalCal}</span>
                            <span className="text-[10px] text-faint">kcal</span>
                        </div>
                    </div>
                    <div className="flex-1 grid grid-cols-3 gap-3">
                        {[
                            { label: 'Protein', val: totalP, color: 'text-primary' },
                            { label: 'Carbs', val: totalC, color: 'text-warning' },
                            { label: 'Fat', val: totalF, color: 'text-success' },
                        ].map(({ label, val, color }) => (
                            <div key={label}>
                                <p className={`text-base font-semibold ${color} tabular-nums`}>{val}g</p>
                                <p className="text-xs text-muted">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Meal list */}
            <Card>
                <h2 className="text-sm font-semibold text-text mb-3">Meals</h2>
                <div className="space-y-0">
                    {meals.map((m) => (
                        <div key={m.name} className="flex items-center justify-between py-3 border-b border-[var(--color-divider)] last:border-0">
                            <div>
                                <p className="text-sm font-medium text-text">{m.name}</p>
                                <p className="text-xs text-muted mt-0.5">{m.time} · P {m.p}g · C {m.c}g · F {m.f}g</p>
                            </div>
                            <span className="text-sm font-medium text-text tabular-nums">{m.cal} kcal</span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    )
}