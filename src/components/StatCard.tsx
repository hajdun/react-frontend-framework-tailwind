import Card from "./Card";

type StatCardProps = {
    label: string;
    value: string | number;
    unit?: string;
    delta?: number;
    deltaLabel?: string;
    icon?: ReactNode;
};

import type { ReactNode } from "react";

export default function StatCard({
    label,
    value,
    unit = "",
    delta = 0,
    deltaLabel = "",
    icon = undefined,
}: StatCardProps) {
    const positive = delta > 0;
    const neutral = delta === 0;

    return (
        <Card>
            <div className="flex items-start justify-between mb-3">
                <p className="text-xs text-muted font-medium uppercase tracking-wide">{label}</p>
                {icon && <span className="text-primary opacity-70">{icon}</span>}
            </div>
            <p className="text-2xl font-semibold text-text tabular-nums">
                {value}
                <span className="text-sm font-normal text-muted ml-1">{unit}</span>
            </p>
            <p
                className={`text-xs mt-1.5 ${neutral ? "text-faint" : positive ? "text-success" : "text-warning"
                    }`}
            >
                {neutral ? "—" : positive ? `↑ ${delta}` : `↓ ${Math.abs(delta)}`}{" "}
                {deltaLabel}
            </p>
        </Card>
    );
}