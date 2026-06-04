// --- Calorie Result Card ---

import type { Activity } from "../api/db"

type CalorieCardProps = {
    activity: Activity | null
    durationMins: number
    weightKg?: number
}

export const calculateBurnedCalories = (MET: number, weightKg: number, mins: number) => {
    const hours = mins / 60
    return Math.round(MET * weightKg * hours)
}

export default function CalorieCard({
    activity,
    durationMins,
    weightKg = 90,
}: CalorieCardProps) {
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

    const calories = calculateBurnedCalories(activity.MET, weightKg, durationMins)

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