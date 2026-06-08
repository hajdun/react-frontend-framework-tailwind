import StatCard from "../components/StatCard.jsx";
import Card from "../components/Card.jsx";
import Badge from "../components/Badge.jsx";

const RECENT = [
    { name: "Morning Run", type: "Cardio", duration: "32 min", cal: 310, date: "Today" },
    { name: "Push Day", type: "Strength", duration: "48 min", cal: 280, date: "Yesterday" },
    { name: "Yoga Flow", type: "Flexibility", duration: "25 min", cal: 120, date: "Mon" },
];

const typeColor = {
    Cardio: "teal",
    Strength: "orange",
    Flexibility: "green",
};

export default function DashboardSum() {
    return (
        <div className="space-y-6">
            {/* Greeting */}
            <section className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-[#ADA4A5]">Welcome Back,</p>
                    <h1 className="mt-1 text-[32px] font-bold leading-none tracking-[-0.03em] text-[#1D1617]">
                        Jane Doe
                    </h1>
                    <p className="mt-3 text-sm text-[#ADA4A5]">
                        You&apos;re on a 5-day streak
                    </p>
                </div>

                <button
                    className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-[0_8px_24px_rgba(29,22,23,0.06)]"
                    aria-label="Notifications"
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#1D1617"
                        strokeWidth="2"
                    >
                        <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
                        <path d="M10 21a2 2 0 0 0 4 0" />
                    </svg>
                </button>
            </section>

            {/* Hero card */}
            <section className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#DA8FFF_0%,#9B5FFF_100%)] p-6 text-white shadow-[0_12px_32px_rgba(123,97,255,0.24)]">
                <div className="relative z-10 max-w-[70%]">
                    <h2 className="text-xl font-semibold">Weekly Progress</h2>
                    <p className="mt-2 text-sm text-white/80">
                        Keep pushing — you&apos;re very close to hitting your activity goal this week.
                    </p>

                    <div className="mt-5">
                        <button className="rounded-full bg-[rgba(255,255,255,0.18)] px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-[rgba(255,255,255,0.24)]">
                            View More
                        </button>
                    </div>
                </div>

                <div className="absolute right-6 top-1/2 flex h-28 w-28 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#C084FC]">
                    <div className="text-center">
                        <p className="text-2xl font-bold leading-none">82%</p>
                        <p className="mt-1 text-xs font-medium text-[#ADA4A5]">Goal</p>
                    </div>
                </div>

                <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-white/15" />
                <div className="absolute -right-4 bottom-3 h-20 w-20 rounded-full bg-white/12" />
                <div className="absolute left-1/3 top-6 h-2.5 w-2.5 rounded-full bg-white/20" />
                <div className="absolute left-1/2 top-12 h-3 w-3 rounded-full bg-white/20" />
                <div className="absolute left-[45%] bottom-8 h-2 w-2 rounded-full bg-white/20" />
            </section>

            {/* Secondary goal strip */}
            <section className="flex items-center justify-between rounded-[24px] bg-[#F3E6FA] px-5 py-5">
                <div>
                    <p className="text-lg font-medium text-[#1D1617]">Today Target</p>
                </div>

                <button className="rounded-full bg-[linear-gradient(135deg,#7B61FF_0%,#A678F7_100%)] px-5 py-2 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(123,97,255,0.18)]">
                    Check
                </button>
            </section>

            {/* Stat section */}
            <section>
                <h2 className="mb-4 text-[28px] font-bold tracking-[-0.03em] text-[#1D1617]">
                    Activity Status
                </h2>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        label="Calories"
                        value="1,840"
                        unit="kcal"
                        delta={120}
                        deltaLabel="vs avg"
                    />
                    <StatCard
                        label="Workouts"
                        value="14"
                        unit="this month"
                        delta={3}
                        deltaLabel="vs last"
                    />
                    <StatCard
                        label="Active mins"
                        value="47"
                        unit="min today"
                        delta={-8}
                        deltaLabel="vs goal"
                    />
                    <StatCard
                        label="Weight"
                        value="68.2"
                        unit="kg"
                        delta={-0.4}
                        deltaLabel="this week"
                    />
                </div>
            </section>

            {/* Main content */}
            <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                <Card className="print:hidden rounded-[24px] bg-[#F3E6FA] shadow-none border-0">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-[#1D1617]">Recent Workouts</h2>
                        <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-[#7B6F72]">
                            This week
                        </span>
                    </div>

                    <div className="space-y-3">
                        {RECENT.map((w) => (
                            <div
                                key={w.name}
                                className="flex items-center justify-between rounded-[18px] bg-white px-4 py-4 shadow-[0_4px_18px_rgba(29,22,23,0.04)]"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F7F8F8]">
                                        <span className="h-2.5 w-2.5 rounded-full bg-[#C084FC]" />
                                    </div>

                                    <div>
                                        <Badge color={typeColor[w.type]}>{w.type}</Badge>
                                        <p className="mt-2 text-sm font-semibold text-[#1D1617]">
                                            {w.name}
                                        </p>
                                        <p className="text-xs text-[#ADA4A5]">
                                            {w.duration} · {w.cal} kcal
                                        </p>
                                    </div>
                                </div>

                                <span className="text-xs font-medium text-[#ADA4A5]">
                                    {w.date}
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="rounded-[24px] bg-white">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-[#1D1617]">Weekly Goal</h2>
                        <p className="mt-1 text-sm text-[#ADA4A5]">
                            Your current progress this week
                        </p>
                    </div>

                    <div className="space-y-4">
                        {[
                            { label: "Workouts", done: 4, goal: 5 },
                            { label: "Cardio mins", done: 95, goal: 150 },
                            { label: "Calories burned", done: 1200, goal: 2000 },
                        ].map(({ label, done, goal }) => (
                            <div key={label} className="rounded-[18px] bg-[#F7F8F8] px-4 py-4">
                                <div className="mb-2 flex items-center justify-between text-sm">
                                    <span className="font-medium text-[#7B6F72]">{label}</span>
                                    <span className="font-semibold text-[#1D1617]">
                                        {done} / {goal}
                                    </span>
                                </div>

                                <div className="h-2 rounded-full bg-white overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-[linear-gradient(135deg,#7B61FF_0%,#C084FC_100%)] transition-all duration-300"
                                        style={{ width: `${Math.min((done / goal) * 100, 100)}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}