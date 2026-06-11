import Card from "./Card.jsx";
import StatCard from "./StatCard.jsx";

const WEIGHT_DATA = [69.8, 69.5, 69.2, 68.9, 68.7, 68.5, 68.2];
const LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MIN = Math.min(...WEIGHT_DATA) - 0.5;
const MAX = Math.max(...WEIGHT_DATA) + 0.5;

function toY(val, h) {
    return h - ((val - MIN) / (MAX - MIN)) * h;
}

export default function Progress() {
    const W = 500;
    const H = 120;

    const points = WEIGHT_DATA.map(
        (v, i) => `${(i / (WEIGHT_DATA.length - 1)) * W},${toY(v, H)}`
    ).join(" ");

    return (
        <div className="space-y-6">
            {/* Header */}
            <section>
                <p className="text-sm font-medium text-[#ADA4A5]">Your stats over time</p>
                <h1 className="mt-1 text-[32px] font-bold leading-none tracking-[-0.03em] text-[#1D1617]">
                    Progress
                </h1>
            </section>

            {/* Stats */}
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <StatCard
                    label="Current Weight"
                    value="68.2"
                    unit="kg"
                    delta={-1.6}
                    deltaLabel="this month"
                />
                <StatCard
                    label="Body Fat"
                    value="18.4"
                    unit="%"
                    delta={-0.8}
                    deltaLabel="this month"
                />
                <StatCard
                    label="Workouts"
                    value="14"
                    unit="this month"
                    delta={3}
                    deltaLabel="vs last"
                />
            </section>

            {/* Highlight summary */}
            <section className="rounded-[24px] bg-[#F3E6FA] px-5 py-5">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-semibold text-[#1D1617]">Average Progress</h2>
                        <p className="mt-1 text-sm text-[#ADA4A5]">
                            Your recent body metrics are moving in the right direction.
                        </p>
                    </div>

                    <span className="text-sm font-semibold text-[#3DDAB4]">Good</span>
                </div>

                <div className="mt-5 h-6 overflow-hidden rounded-full bg-white/70">
                    <div
                        className="flex h-full items-center justify-center rounded-full bg-[linear-gradient(135deg,#DA8FFF_0%,#9B5FFF_100%)] text-xs font-semibold text-white"
                        style={{ width: "62%" }}
                    >
                        62%
                    </div>
                </div>
            </section>

            {/* Weight chart */}
            <Card className="rounded-[24px] bg-white">
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-[#1D1617]">Weight This Week</h2>
                        <p className="mt-1 text-sm text-[#ADA4A5]">
                            Smooth weekly trend based on logged check-ins
                        </p>
                    </div>

                    <span className="rounded-full bg-[#00E58F] px-4 py-2 text-xs font-semibold text-white">
                        Weekly
                    </span>
                </div>

                <div className="rounded-[22px] bg-[#FCFCFC] px-4 py-5">
                    <svg
                        viewBox={`0 0 ${W} ${H + 28}`}
                        className="h-[220px] w-full"
                        preserveAspectRatio="none"
                    >
                        <defs>
                            <linearGradient id="weightArea" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#C084FC" stopOpacity="0.28" />
                                <stop offset="100%" stopColor="#C084FC" stopOpacity="0.02" />
                            </linearGradient>

                            <linearGradient id="weightLine" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#DA8FFF" />
                                <stop offset="100%" stopColor="#9B5FFF" />
                            </linearGradient>
                        </defs>

                        {[0, 1, 2, 3].map((row) => (
                            <line
                                key={row}
                                x1="0"
                                x2={W}
                                y1={(H / 3) * row}
                                y2={(H / 3) * row}
                                stroke="#F1ECF5"
                                strokeWidth="1"
                            />
                        ))}

                        <polygon
                            points={`0,${H} ${points} ${W},${H}`}
                            fill="url(#weightArea)"
                        />

                        <polyline
                            points={points}
                            fill="none"
                            stroke="url(#weightLine)"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />

                        {WEIGHT_DATA.map((v, i) => {
                            const x = (i / (WEIGHT_DATA.length - 1)) * W;
                            const y = toY(v, H);

                            return (
                                <g key={i}>
                                    <circle cx={x} cy={y} r="6" fill="white" />
                                    <circle cx={x} cy={y} r="4" fill="#C084FC" />
                                    <text
                                        x={x}
                                        y={H + 20}
                                        textAnchor="middle"
                                        fontSize="12"
                                        fontWeight="500"
                                        fill="#ADA4A5"
                                    >
                                        {LABELS[i]}
                                    </text>
                                </g>
                            );
                        })}
                    </svg>
                </div>
            </Card>

            {/* Records */}
            <Card className="rounded-[24px] bg-white">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-[#1D1617]">Personal Records</h2>
                    <span className="text-sm font-medium text-[#ADA4A5]">Latest bests</span>
                </div>

                <div className="space-y-3">
                    {[
                        { name: "Bench Press", record: "85 kg", date: "2 weeks ago" },
                        { name: "Squat", record: "110 kg", date: "1 month ago" },
                        { name: "Deadlift", record: "130 kg", date: "3 weeks ago" },
                        { name: "5K Run", record: "24:15", date: "Last week" },
                    ].map(({ name, record, date }) => (
                        <div
                            key={name}
                            className="flex items-center justify-between rounded-[18px] bg-[#F7F8F8] px-4 py-4"
                        >
                            <div>
                                <p className="text-sm font-semibold text-[#1D1617]">{name}</p>
                                <p className="mt-1 text-xs text-[#ADA4A5]">{date}</p>
                            </div>

                            <div className="text-right">
                                <p className="text-base font-semibold tabular-nums text-[#C084FC]">
                                    {record}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}