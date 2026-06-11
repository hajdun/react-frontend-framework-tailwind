import { useRef, useState } from "react";
import { createCsv, parseCsv } from "../utilityFunctions/csv";
import {
    fetchActivities,
    postActivity,
    type Activity,
} from "../api/db";
import Button from "../components/Button";
import StatCard from "../components/StatCard";
import ActivityManagementTable from "../components/sortFilterSearchTable/ActivityManagementTable";


export default function ActivitiesAdmin() {
    const [displayedActivities, setDisplayedActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(false);

    const fileRef = useRef<HTMLInputElement>(null);


    const fetchActivitiesFromStore = async () => {
        const mets = await fetchActivities() || [];
        setDisplayedActivities(mets as Activity[])
    };


    const importActivitiesFromFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setLoading(true)

        try {
            const text = await file.text()
            const rows = parseCsv(text)

            setDisplayedActivities(rows)
        } catch (err) {

        } finally {
            setLoading(false)
            if (fileRef.current) fileRef.current.value = ''
        }
    }

    const exportActivities = () => {
        createCsv(displayedActivities)
    }


    return (
        <div className="mx-auto w-full max-w-[1280px] space-y-6">
            {/* Hero */}
            <section className="overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#DA8FFF_0%,#9B5FFF_100%)] px-6 py-7 text-white shadow-[0_12px_32px_rgba(123,97,255,0.24)] sm:px-8">
                <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                    <div className="max-w-3xl">
                        <p className="text-sm font-medium text-white/70">Admin workspace</p>
                        <h1 className="mt-2 text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
                            MET Activity Admin
                        </h1>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">
                            Import, edit, export and manage your dataset in a softer interface
                            inspired by the fitness app design.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3 sm:max-w-[420px] sm:gap-4">
                        <div className="rounded-[20px] bg-white/14 px-4 py-3 backdrop-blur-sm">
                            <p className="text-xs text-white/70">Rows</p>
                            <p className="mt-1 text-2xl font-semibold">{displayedActivities.length}</p>
                        </div>
                        <div className="rounded-[20px] bg-white/14 px-4 py-3 backdrop-blur-sm">
                            <p className="text-xs text-white/70">State</p>
                            <p className="mt-1 text-sm font-semibold">
                                {loading ? "Loading" : "Ready"}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="rounded-[22px] bg-[#FCFCFC] px-6 py-6 text-center">

                    <div className="mt-6 flex justify-center">
                        <Button>
                            <label className="flex cursor-pointer items-center justify-center">
                                Import CSV
                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept=".csv,text/csv"
                                    className="hidden"
                                    onChange={importActivitiesFromFile}
                                />
                            </label>
                        </Button>

                        <Button onClick={fetchActivitiesFromStore}>
                            Fetch saved activities
                        </Button>
                    </div>
                </div>
            </section>

            {/* Stats */}
            {displayedActivities.length > 0 && (
                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <StatCard label="Total rows" value={displayedActivities.length} />
                    <StatCard label="Visible rows" value={displayedActivities.length} />
                </section>
            )}

            {/* Full width table */}
            <section className="rounded-[24px] bg-white p-4 shadow-[0_8px_30px_rgba(29,22,23,0.06)] sm:p-6">
                {displayedActivities.length > 0 ? (<div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-[#1D1617]">Activity table</h2>
                        <p className="mt-1 text-sm text-[#ADA4A5]">
                            Full-width editable table centered as the main content area.
                        </p>
                    </div>

                    <Button
                        type="button"
                        onClick={exportActivities}
                        className="inline-flex items-center justify-center rounded-full md:w-80"
                    >
                        Download as CSV
                    </Button>
                </div>) : <div>
                    Import or fetch activities
                </div>}

                {displayedActivities.length && (
                    <ActivityManagementTable displayedActivities={displayedActivities} postActivity={postActivity} deleteActivity={() => { }} />
                )}
            </section>
        </div>
    );
}