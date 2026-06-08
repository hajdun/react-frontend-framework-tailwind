import { Outlet, NavLink, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

const NAV = [
    { to: "/", label: "Dashboard", end: true },
    {
        to: "/workout",
        label: "Workouts",
        submenu: [
            { to: "/workout", label: "My Workouts", end: true },
            { to: "/post_workout", label: "Post Your Workout" },
        ],
    },
    { to: "/nutition", label: "Nutrition" },
    { to: "/settings", label: "Settings" },
    { to: "/activity_admin", label: "Manage Activities" },
];

const linkBase =
    "inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200";

const activeCls =
    "bg-[linear-gradient(135deg,#7B61FF_0%,#C084FC_100%)] text-white shadow-[0_8px_24px_rgba(123,97,255,0.28)]";

const idleCls =
    "text-[#7B6F72] hover:bg-[#F7F8F8] hover:text-[#1D1617]";

function DropdownNav({
    to,
    label,
    submenu,
}: {
    to: string;
    label: string;
    submenu: { to: string; label: string; end?: boolean }[];
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const location = useLocation();

    const isParentActive =
        location.pathname === to || submenu.some((s) => location.pathname === s.to);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen((o) => !o)}
                className={`${linkBase} ${isParentActive ? activeCls : idleCls}`}
            >
                <span>{label}</span>
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.25"
                    className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                >
                    <path d="M6 9l6 6 6-6" />
                </svg>
            </button>

            {open && (
                <div
                    className="
            absolute left-0 top-full z-50 mt-3 min-w-[220px]
            rounded-[22px] border border-white/70 bg-white p-2
            shadow-[0_12px_32px_rgba(29,22,23,0.10)]
            backdrop-blur-sm
          "
                >
                    <div className="mb-1 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ADA4A5]">
                        Workout
                    </div>

                    <div className="flex flex-col gap-1">
                        {submenu.map(({ to: subTo, label: subLabel, end }) => (
                            <NavLink
                                key={subTo}
                                to={subTo}
                                end={end}
                                onClick={() => setOpen(false)}
                                className={({ isActive }) =>
                                    [
                                        "rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200",
                                        isActive
                                            ? "bg-[linear-gradient(135deg,#7B61FF_0%,#C084FC_100%)] text-white shadow-[0_8px_20px_rgba(123,97,255,0.22)]"
                                            : "text-[#7B6F72] hover:bg-[#F7F8F8] hover:text-[#1D1617]",
                                    ].join(" ")
                                }
                            >
                                {subLabel}
                            </NavLink>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function BasePage() {
    return (
        <div className="min-h-dvh bg-[#FCFCFC] text-[#1D1617]">
            <header className="print:hidden sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur-xl">
                <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">


                    <nav className="hidden items-center gap-2 rounded-full border border-[#F1F1F1] bg-white px-2 py-2 shadow-[0_8px_30px_rgba(29,22,23,0.05)] md:flex">
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

                </div>

                <div className="mx-auto flex max-w-[1180px] gap-2 overflow-x-auto px-4 pb-4 md:hidden sm:px-6 lg:px-8">
                    {NAV.map(({ to, label, end, submenu }) =>
                        submenu ? (
                            <DropdownNav key={to} to={to} label={label} submenu={submenu} />
                        ) : (
                            <NavLink
                                key={to}
                                to={to}
                                end={end as boolean}
                                className={({ isActive }) =>
                                    `whitespace-nowrap ${linkBase} ${isActive ? activeCls : idleCls}`
                                }
                            >
                                {label}
                            </NavLink>
                        )
                    )}
                </div>
            </header>

            <main className="mx-auto max-w-[1180px] px-4 py-8 sm:px-6 lg:px-8">
                <div className="rounded-[28px] bg-white p-4 shadow-[0_12px_40px_rgba(29,22,23,0.05)] sm:p-6 lg:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

export default BasePage;