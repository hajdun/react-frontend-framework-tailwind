import { useState } from "react";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";

const MEALS = [
    { name: "Oatmeal with berries", time: "8:00", cal: 340, p: 12, c: 58, f: 8 },
    { name: "Chicken & rice bowl", time: "12:30", cal: 520, p: 42, c: 55, f: 9 },
    { name: "Greek yogurt", time: "15:00", cal: 130, p: 15, c: 10, f: 3 },
    { name: "Salmon & veggies", time: "19:00", cal: 480, p: 38, c: 30, f: 18 },
];

const GOAL = 2000;
const totalCal = MEALS.reduce((s, m) => s + m.cal, 0);
const totalP = MEALS.reduce((s, m) => s + m.p, 0);
const totalC = MEALS.reduce((s, m) => s + m.c, 0);
const totalF = MEALS.reduce((s, m) => s + m.f, 0);

export default function Nutrition() {
    const [meals] = useState(MEALS);
    const progress = Math.min((totalCal / GOAL) * 100, 100);

    return (
        <div className="space-y-6">
            {/* Header */}
            <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-medium text-[#ADA4A5]">Today's food log</p>
                    <h1 className="mt-1 text-[32px] font-bold leading-none tracking-[-0.03em] text-[#1D1617]">
                        Nutrition
                    </h1>
                </div>

                <Button size="sm">+ Add Meal</Button>
            </section>

            {/* Meal nutrition summary */}
            <section className="rounded-[24px] bg-white p-5 shadow-[0_8px_30px_rgba(29,22,23,0.06)] sm:p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-[#1D1617]">Meal Nutritions</h2>
                    <button className="rounded-full bg-[linear-gradient(135deg,#7B61FF_0%,#A678F7_100%)] px-4 py-2 text-xs font-semibold text-white shadow-[0_8px_20px_rgba(123,97,255,0.18)]">
                        Weekly
                    </button>
                </div>

                <div className="rounded-[22px] bg-[#FCFCFC] px-4 py-5">
                    <div className="mb-6 h-2 rounded-full bg-[#EEEAEA] overflow-hidden">
                        <div
                            className="h-full rounded-full bg-[linear-gradient(135deg,#DA8FFF_0%,#9B5FFF_100%)] transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-[120px_1fr] sm:items-center">
                        <div className="relative mx-auto h-24 w-24 sm:mx-0">
                            <svg viewBox="0 0 36 36" className="h-24 w-24 -rotate-90">
                                <circle
                                    cx="18"
                                    cy="18"
                                    r="15.9"
                                    fill="none"
                                    stroke="#EEEAEA"
                                    strokeWidth="3.5"
                                />
                                <circle
                                    cx="18"
                                    cy="18"
                                    r="15.9"
                                    fill="none"
                                    stroke="url(#calRing)"
                                    strokeWidth="3.5"
                                    strokeDasharray={`${progress} 100`}
                                    strokeLinecap="round"
                                />
                                <defs>
                                    <linearGradient id="calRing" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor="#DA8FFF" />
                                        <stop offset="100%" stopColor="#9B5FFF" />
                                    </linearGradient>
                                </defs>
                            </svg>

                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-base font-bold tabular-nums text-[#1D1617]">
                                    {totalCal}
                                </span>
                                <span className="text-[11px] text-[#ADA4A5]">kcal</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            {[
                                {
                                    label: "Protein",
                                    val: totalP,
                                    color: "text-[#00E58F]",
                                    bg: "bg-[#DDF8EE]",
                                },
                                {
                                    label: "Carbs",
                                    val: totalC,
                                    color: "text-[#7B61FF]",
                                    bg: "bg-[#EEE9FF]",
                                },
                                {
                                    label: "Fat",
                                    val: totalF,
                                    color: "text-[#FF9F43]",
                                    bg: "bg-[#FFF1DF]",
                                },
                            ].map(({ label, val, color, bg }) => (
                                <div
                                    key={label}
                                    className={`rounded-[18px] px-4 py-4 text-center ${bg}`}
                                >
                                    <p className={`text-lg font-semibold tabular-nums ${color}`}>
                                        {val}g
                                    </p>
                                    <p className="mt-1 text-xs text-[#ADA4A5]">{label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Schedule card */}
            <section className="flex items-center justify-between rounded-[24px] bg-[#F3E6FA] px-5 py-5">
                <div>
                    <p className="text-lg font-medium text-[#1D1617]">Daily Meal Schedule</p>
                </div>

                <button className="rounded-full bg-[linear-gradient(135deg,#7B61FF_0%,#A678F7_100%)] px-5 py-2 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(123,97,255,0.18)]">
                    Check
                </button>
            </section>

            {/* Today meals */}
            <section>
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-[28px] font-bold tracking-[-0.03em] text-[#1D1617]">
                        Today Meals
                    </h2>

                    <button className="rounded-full bg-[#00E58F] px-4 py-2 text-xs font-semibold text-white shadow-[0_8px_20px_rgba(0,229,143,0.18)]">
                        Breakfast
                    </button>
                </div>

                <div className="space-y-4">
                    {meals.map((m, idx) => {
                        const iconBg =
                            idx % 3 === 0
                                ? "bg-[#DDF8EE]"
                                : idx % 3 === 1
                                    ? "bg-[#EEE9FF]"
                                    : "bg-[#FFF1DF]";

                        return (
                            <Card
                                key={m.name}
                                className="rounded-[24px] border-0 bg-white shadow-[0_8px_24px_rgba(29,22,23,0.05)]"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex min-w-0 items-center gap-4">
                                        <div
                                            className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-[18px] ${iconBg}`}
                                        >
                                            <span className="text-xl">
                                                {idx === 0 ? "🥣" : idx === 1 ? "🍱" : idx === 2 ? "🥛" : "🐟"}
                                            </span>
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate text-base font-semibold text-[#1D1617]">
                                                {m.name}
                                            </p>
                                            <p className="mt-1 text-sm text-[#ADA4A5]">
                                                Today | {m.time}
                                            </p>
                                            <p className="mt-1 text-xs text-[#ADA4A5]">
                                                P {m.p}g · C {m.c}g · F {m.f}g
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-base font-semibold tabular-nums text-[#7B61FF]">
                                            {m.cal}
                                        </p>
                                        <p className="text-xs text-[#ADA4A5]">kcal</p>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </section>

            {/* Find something to eat */}
            <section>
                <h2 className="mb-4 text-[28px] font-bold tracking-[-0.03em] text-[#1D1617]">
                    Find Something to Eat
                </h2>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="overflow-hidden rounded-[28px] bg-[#CFF3E8] p-5">
                        <div className="flex justify-end text-6xl">🥞</div>
                        <h3 className="mt-2 text-2xl font-semibold text-[#1D1617]">Breakfast</h3>
                        <p className="mt-1 text-sm text-[#7B6F72]">120+ Foods</p>
                        <button className="mt-6 rounded-full bg-[#00E58F] px-8 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(0,229,143,0.18)]">
                            Select
                        </button>
                    </div>

                    <div className="overflow-hidden rounded-[28px] bg-[#F3E6FA] p-5">
                        <div className="flex justify-end text-6xl">🍲</div>
                        <h3 className="mt-2 text-2xl font-semibold text-[#1D1617]">Lunch</h3>
                        <p className="mt-1 text-sm text-[#7B6F72]">130+ Foods</p>
                        <button className="mt-6 rounded-full bg-[linear-gradient(135deg,#7B61FF_0%,#A678F7_100%)] px-8 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(123,97,255,0.18)]">
                            Select
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}