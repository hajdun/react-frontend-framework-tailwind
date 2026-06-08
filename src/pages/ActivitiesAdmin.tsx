import { useEffect, useRef, useState } from "react";
import { parseCsv, toCsv } from "../utilityFunctions/csv";
import {
    fetchActivities,
    postActivity,
    type Activity,
    type ActivityDraft,
} from "../api/db";
import Button from "../components/Button";
import StatCard from "../components/StatCard";

type DraftMap = Record<string, ActivityDraft>;

export default function ActivitiesAdmin() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [drafts, setDrafts] = useState<DraftMap>({});
    const [status, setStatus] = useState("Ready.");
    const [statusTone, setStatusTone] = useState<"neutral" | "success" | "error">(
        "neutral"
    );
    const [loading, setLoading] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const fileRef = useRef<HTMLInputElement>(null);

    function toast(
        msg: string,
        tone: "neutral" | "success" | "error" = "neutral"
    ) {
        setStatus(msg);
        setStatusTone(tone);
    }

    const refreshList = async () => {
        const mets = fetchActivities();
        setActivities(mets);
    };

    useEffect(() => {
        refreshList();
    }, [status]);
    async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return
        setLoading(true)
        toast('Reading CSV…')
        try {
            const text = await file.text()
            const rows = parseCsv(text)

            setActivities(rows)

        } catch (err) {
            toast(err instanceof Error ? err.message : 'Import failed.', 'error')
        } finally {
            setLoading(false)
            if (fileRef.current) fileRef.current.value = ''
        }
    }



    function toggleOne(id: string, checked: boolean) {
        setSelectedIds((prev) => {
            const s = new Set(prev);
            checked ? s.add(id) : s.delete(id);
            return s;
        });
    }

    function updateDraft<K extends keyof ActivityDraft>(
        id: string,
        key: K,
        val: ActivityDraft[K]
    ) {
        setDrafts((prev) => ({
            ...prev,
            [id]: { ...prev[id], [key]: val },
        }));
    }

    const statusToneCls = {
        neutral: "bg-[#F7F8F8] text-[#7B6F72] border-[#EEEAEA]",
        success: "bg-[#EDFAF5] text-[#3DDAB4] border-[#CFF3E8]",
        error: "bg-[#FFF1F4] text-[#FF6B9D] border-[#FFD4E0]",
    }[statusTone];

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
                            <p className="mt-1 text-2xl font-semibold">{activities.length}</p>
                        </div>
                        <div className="rounded-[20px] bg-white/14 px-4 py-3 backdrop-blur-sm">
                            <p className="text-xs text-white/70">Selected</p>
                            <p className="mt-1 text-2xl font-semibold">{selectedIds.size}</p>
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





            {/* Stats */}
            {activities.length > 0 && (
                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <StatCard label="Total rows" value={activities.length} />
                    <StatCard label="Visible rows" value={activities.length} />
                    <StatCard label="Selected rows" value={selectedIds.size} />
                </section>
            )}

            {/* Full width table */}
            <section className="rounded-[24px] bg-white p-4 shadow-[0_8px_30px_rgba(29,22,23,0.06)] sm:p-6">
                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-[#1D1617]">Activity table</h2>
                        <p className="mt-1 text-sm text-[#ADA4A5]">
                            Full-width editable table centered as the main content area.
                        </p>
                    </div>
                </div>

                {activities.length ? (
                    <div className="overflow-x-auto rounded-[20px] border border-[#F1F1F1] bg-[#FCFCFC]">
                        <table className="min-w-full border-separate border-spacing-0">
                            <thead>
                                <tr className="bg-[#F7F8F8] text-left">
                                    <th className="rounded-tl-[20px] px-4 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#ADA4A5]">
                                        Select
                                    </th>
                                    <th className="px-4 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#ADA4A5]">
                                        MET
                                    </th>
                                    <th className="px-4 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#ADA4A5]">
                                        Main heading
                                    </th>
                                    <th className="px-4 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#ADA4A5]">
                                        Activity description
                                    </th>
                                    <th className="rounded-tr-[20px] px-4 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#ADA4A5]">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {activities.map((activity, index) => {
                                    const draftId = `${activity.Main}-${index}`;
                                    const draft = {
                                        MET: activity.MET,
                                        Main: activity.Main,
                                        ActivityDesc: activity.ActivityDesc,
                                    };

                                    return (
                                        <tr
                                            key={draftId}
                                            className="align-top transition-colors hover:bg-white"
                                        >
                                            <td className="border-t border-[#F1F1F1] px-4 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.has(draftId)}
                                                    onChange={(e) => toggleOne(draftId, e.target.checked)}
                                                    className="h-4 w-4 rounded border-[#DDDADA] text-[#7B61FF] focus:ring-[#7B61FF]"
                                                />
                                            </td>

                                            <td className="border-t border-[#F1F1F1] px-4 py-4">
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={draft.MET}
                                                    onChange={(e) =>
                                                        updateDraft(draftId, "MET", Number(e.target.value))
                                                    }
                                                    className="w-24 rounded-full border border-[#EAE7E7] bg-[#EEE9FF] px-4 py-2 text-sm font-semibold text-[#7B61FF] outline-none transition focus:border-[#7B61FF] focus:bg-white"
                                                />
                                            </td>

                                            <td className="border-t border-[#F1F1F1] px-4 py-4">
                                                <input
                                                    type="text"
                                                    value={draft.Main}
                                                    onChange={(e) =>
                                                        updateDraft(draftId, "Main", e.target.value)
                                                    }
                                                    className="w-full rounded-[16px] border border-[#EAE7E7] bg-white px-4 py-3 text-sm font-medium text-[#1D1617] outline-none transition focus:border-[#7B61FF]"
                                                />
                                            </td>

                                            <td className="border-t border-[#F1F1F1] px-4 py-4">
                                                <input
                                                    type="text"
                                                    value={draft.ActivityDesc}
                                                    onChange={(e) =>
                                                        updateDraft(draftId, "ActivityDesc", e.target.value)
                                                    }
                                                    className="w-full rounded-[16px] border border-[#EAE7E7] bg-white px-4 py-3 text-sm font-medium text-[#1D1617] outline-none transition focus:border-[#7B61FF]"
                                                />
                                            </td>

                                            <td className="border-t border-[#F1F1F1] px-4 py-4">
                                                <div className="flex flex-wrap gap-2">
                                                    <Button
                                                        type="button"
                                                        variant="danger"
                                                        size="sm"
                                                        className="min-w-[88px]"
                                                        onClick={() => console.log(activity.id)}
                                                    >
                                                        Delete
                                                    </Button>

                                                    <Button
                                                        type="button"
                                                        variant="primary"
                                                        size="sm"
                                                        className="min-w-[88px]"
                                                        onClick={() => {
                                                            const result = postActivity({
                                                                ...activity,
                                                                ...draft,
                                                            });
                                                            alert(result?.message);
                                                        }}
                                                    >
                                                        Save
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="rounded-[22px] bg-[#FCFCFC] px-6 py-12 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,#7B61FF_0%,#C084FC_100%)] text-white shadow-[0_10px_30px_rgba(123,97,255,0.25)]">
                            <svg
                                width="26"
                                height="26"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M12 3v12" />
                                <path d="M7 10l5 5 5-5" />
                                <path d="M5 21h14" />
                            </svg>
                        </div>

                        <h3 className="mt-5 text-2xl font-semibold text-[#1D1617]">
                            No activities yet
                        </h3>
                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#ADA4A5]">
                            Import a CSV file to populate the table and begin editing.
                        </p>

                        <div className="mt-6 flex justify-center">
                            <Button>
                                <label className="flex cursor-pointer items-center justify-center">
                                    Import CSV
                                    <input
                                        ref={fileRef}
                                        type="file"
                                        accept=".csv,text/csv"
                                        className="hidden"
                                        onChange={handleImport}
                                    />
                                </label>
                            </Button>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}