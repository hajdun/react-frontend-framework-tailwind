import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'

const NAV = [
    { to: '/', label: 'Dashboard', end: true },
    {
        to: '/workout', label: 'Workouts', submenu: [
            { to: '/workout', label: 'My Workouts', end: true },
            { to: '/post_workout', label: 'Post Your Workout' },
        ]
    },
    { to: '/nutition', label: 'Nutrition' },
    { to: '/settings', label: 'Settings' },
]

const activeCls = 'bg-[oklch(from_var(--color-primary)_l_c_h_/_0.1)] text-[var(--color-primary)] font-medium'
const idleCls = 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-offset)] hover:text-[var(--color-text)]'
const linkBase = 'px-3 py-2 rounded-lg text-sm transition-colors'

function DropdownNav({ to, label, submenu }: {
    to: string
    label: string
    submenu: { to: string; label: string; end?: boolean }[]
}) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    const location = useLocation()

    const isParentActive = location.pathname === to ||
        submenu.some(s => location.pathname === s.to)

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(o => !o)}
                className={`${linkBase} flex items-center gap-1 ${isParentActive ? activeCls : idleCls}`}
            >
                {label}
                <svg
                    width="14" height="14" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2.5"
                    className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                >
                    <path d="M6 9l6 6 6-6" />
                </svg>
            </button>

            {open && (
                <div className="absolute top-full left-0 mt-1 min-w-[180px] z-50 align-left
                    bg-white border border-[var(--color-border)]
                    rounded-xl shadow-md py-1 flex flex-col ">
                    {submenu.map(({ to: subTo, label: subLabel, end }) => (
                        <NavLink
                            key={subTo}
                            to={subTo}
                            end={end}
                            onClick={() => setOpen(false)}
                            className={({ isActive }) =>
                                `hover:bg-gray-200 px-4 py-2 text-sm transition-colors ${isActive ? activeCls : idleCls}`
                            }
                        >
                            {subLabel}
                        </NavLink>
                    ))}
                </div>
            )}
        </div>
    )
}

function BasePage() {
    return (
        <div>
            <header>
                <nav className="flex items-center gap-1">
                    {NAV.map(({ to, label, end, submenu }) =>
                        submenu ? (
                            <DropdownNav key={to} to={to} label={label} submenu={submenu} />
                        ) : (
                            <NavLink
                                key={to}
                                to={to}
                                end={end as boolean}
                                className={({ isActive }) =>
                                    `${linkBase} ${isActive ? activeCls : idleCls}`
                                }
                            >
                                {label}
                            </NavLink>
                        )
                    )}
                </nav>
            </header>
            <main style={{ maxWidth: '960px', margin: '0 auto', padding: 'var(--space-8) var(--space-4)' }}>
                <Outlet />
            </main>
        </div>
    )
}

export default BasePage