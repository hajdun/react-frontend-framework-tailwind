import type { ReactNode } from "react";

const colors = {
    green: "bg-[oklch(from_var(--color-success)_l_c_h_/_0.12)] text-success",
    orange: "bg-[oklch(from_var(--color-warning)_l_c_h_/_0.12)] text-warning",
    teal: "bg-[oklch(from_var(--color-primary)_l_c_h_/_0.12)] text-primary",
    gray: "bg-[var(--color-surface-offset)] text-muted",
} as const;

type BadgeColor = keyof typeof colors;

type BadgeProps = {
    children: ReactNode;
    color?: BadgeColor;
    className?: string;
};

export default function Badge({ children, color = "gray", className = "" }: BadgeProps) {
    return (
        <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${colors[color]} ${className}`}
        >
            {children}
        </span>
    );
}