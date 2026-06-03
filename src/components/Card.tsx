
type CardProps = {
    children: React.ReactNode,
    className?: string
}

export default function Card({ children, className = '' }: CardProps) {
    return (
        <div
            className={`bg-surface border border-[var(--color-border)] rounded-xl p-5 shadow-[var(--shadow-sm)] ${className}`}
        >
            {children}
        </div>
    )
}