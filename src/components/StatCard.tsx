import type { ReactNode } from "react";
import Card from "./Card";

type StatCardProps = {
    label: string;
    value: string | number;
    unit?: string;
    delta?: number;
    deltaLabel?: string;
    icon?: ReactNode;
};

export default function StatCard({
    label,
    value,
    unit = "",
    delta = 0,
    deltaLabel = "",
    icon,
}: StatCardProps) {
    const positive = delta > 0;
    const neutral = delta === 0;

    return (
        <Card className="rounded-[22px] bg-white shadow-[0_4px_20px_rgba(29,22,23,0.07)] border border-white px-5 py-4">
            <div className="mb-2 flex items-start justify-between gap-3">
                <p className="text-[11px] font-medium tracking-[0.02em] text-[#ADA4A5]">
                    {label}
                </p>

                {icon && (
                    <span className="text-[#7B61FF] opacity-80 [&_svg]:h-4 [&_svg]:w-4">
                        {icon}
                    </span>
                )}
            </div>

            <div className="flex items-end gap-1">
                <p className="text-[24px] font-semibold leading-none tracking-[-0.02em] text-[#C084FC] tabular-nums">
                    {value}
                </p>

                {unit && (
                    <span className="pb-0.5 text-[12px] font-medium text-[#C084FC]">
                        {unit}
                    </span>
                )}
            </div>

            <p className="mt-2 text-[12px] font-medium text-[#ADA4A5]">
                {neutral ? (
                    "No change"
                ) : positive ? (
                    <span className="text-[#3DDAB4]">
                        +{delta} {deltaLabel}
                    </span>
                ) : (
                    <span className="text-[#FF6B9D]">
                        -{Math.abs(delta)} {deltaLabel}
                    </span>
                )}
            </p>
        </Card>
    );
}