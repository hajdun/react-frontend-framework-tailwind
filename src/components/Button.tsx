import { type ButtonHTMLAttributes } from "react";

const variants = {
    primary: "bg-primary hover:bg-primary-hover text-white",
    secondary:
        "bg-[var(--color-surface-offset)] hover:bg-[var(--color-divider)] text-text border border-[var(--color-border)]",
    ghost:
        "hover:bg-[var(--color-surface-offset)] text-muted hover:text-text",
} as const;

const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-md",
    md: "px-4 py-2 text-sm rounded-lg",
    lg: "px-5 py-2.5 text-sm rounded-lg",
} as const;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: keyof typeof variants;
    size?: keyof typeof sizes;
    className?: string;
};

export default function Button({
    children,
    variant = "primary",
    size = "md",
    className = "",
    ...props
}: ButtonProps) {
    return (
        <button
            className={`
        inline-flex items-center gap-2 font-medium transition-colors duration-150
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
            {...props}
        >
            {children}
        </button>
    );
}