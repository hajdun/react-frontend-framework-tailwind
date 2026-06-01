export default function Card({ children, className = '' }) {
    return (
        <div
            className={`bg-surface border border-[var(--color-border)] rounded-xl p-5 shadow-[var(--shadow-sm)] ${className}`}
        >
            {children}
        </div>
    )
}