import { type ButtonHTMLAttributes, type ReactNode } from "react";

// Extracted from Figma: purple gradient primary, pill shape, white bg secondary
const commonProps =
    "rounded-full cursor-pointer inline-flex items-center justify-center gap-2 font-bold tracking-wide transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-purple-400 active:scale-[0.97]";

const variants = {
    // Main CTA — purple gradient pill (matches "Register" / "View More" button)
    primary: `bg-gradient-to-r from-[#7B61FF] to-[#C084FC] hover:from-[#6B51EF] hover:to-[#B074EC] text-white shadow-lg shadow-purple-300/40 ${commonProps}`,

    // White surface card button — matches "Check" button on Home screen
    secondary: `bg-white hover:bg-purple-50 text-[#7B61FF] border border-purple-200 shadow-sm ${commonProps}`,

    // Ghost — no background, purple label
    ghost: `hover:bg-purple-50 text-[#7B61FF] hover:text-purple-700 ${commonProps}`,

    // Danger
    danger: `bg-red-500 hover:bg-red-600 text-white shadow-sm ${commonProps}`,

    // Continue/resume action
    continue: `bg-blue-500 hover:bg-blue-600 text-white shadow-sm ${commonProps}`,

    // Small inline pill — e.g. "View More" on cards
    "card-pill": `bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border border-white/30 ${commonProps}`,
} as const;

const sizes = {
    sm: "px-4 py-1.5 text-xs",
    md: "px-5 py-2 text-sm",
    lg: "px-6 py-3 text-base w-full",   // Full-width — matches "Register" in Figma
    xl: "px-8 py-4 text-lg w-full",
} as const;

type ButtonVariant = keyof typeof variants;
type ButtonSize = keyof typeof sizes;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    className?: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    buttonId?: string;
};


export default function Button({
    children,
    variant = "primary",
    size = "lg",        // default lg — matches Figma's full-width CTA
    className = "",
    leftIcon,
    rightIcon,
    disabled,
    buttonId = "",
    ...props
}: ButtonProps) {
    return (
        <button
            className={`${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled}
            data-test={`button-${buttonId}`}
            {...props}
        >
            <>
                {leftIcon && <span className="shrink-0">{leftIcon}</span>}
                {children}
                {rightIcon && <span className="shrink-0">{rightIcon}</span>}
            </>
        </button>
    );
}