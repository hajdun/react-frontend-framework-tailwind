import { useState, useEffect, useMemo } from 'react'
import { Outlet, NavLink } from 'react-router-dom'

const NAV = [
    { to: '/', label: 'Dashboard', end: true },
    { to: '/workout', label: 'Workouts' },
    { to: '/nutition', label: 'Nutrition' },
    { to: '/progress', label: 'Progress' },
]

function BasePage() {

    return (
        <div >
            <header >
                <nav>
                    {NAV.map(({ to, label, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                `px-3 py-2 rounded-lg text-sm transition-colors ${isActive
                                    ? 'bg-[oklch(from_var(--color-primary)_l_c_h_/_0.1)] text-primary font-medium'
                                    : 'text-muted hover:bg-[var(--color-surface-offset)] hover:text-text'
                                }`
                            }
                        >
                            {label}
                        </NavLink>
                    ))}
                </nav>
            </header>
            <main style={{ maxWidth: '960px', margin: '0 auto', padding: 'var(--space-8) var(--space-4)' }}>
                <Outlet />
            </main>
        </div>
    )
}

export default BasePage