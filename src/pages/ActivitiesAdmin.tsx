import { useEffect, useRef, useState } from 'react'

import { parseCsv, toCsv } from '../utilityFunctions/csv'
import { fetchActivities, postActivity, type Activity, type ActivityDraft } from '../api/db';
import Button from '../components/Button';
import StatCard from '../components/StatCard';

// ─── Types ────────────────────────────────────────────────────────────────────


type DraftMap = Record<string, ActivityDraft>





// ─── Main component ───────────────────────────────────────────────────────────

export default function ActivitiesAdmin() {
    const [activities, setActivities] = useState<Activity[]>([])
    const [drafts, setDrafts] = useState<DraftMap>({})
    const [status, setStatus] = useState('Ready.')
    const [statusTone, setStatusTone] = useState<'neutral' | 'success' | 'error'>('neutral')
    const [loading, setLoading] = useState(false)
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
    const fileRef = useRef<HTMLInputElement>(null)

    function toast(msg: string, tone: 'neutral' | 'success' | 'error' = 'neutral') {
        setStatus(msg); setStatusTone(tone)
    }

    const refreshList = async () => {
        const mets = fetchActivities()
        setActivities(mets)
    }

    useEffect(() => {
        refreshList()
    }, [status])



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

    function handleExport() {
        const csv = toCsv(activities)
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const a = Object.assign(document.createElement('a'), { href: url, download: 'met-activities.csv' })
        a.click()
        URL.revokeObjectURL(url)
        toast(`Exported ${activities.length} activities.`, 'success')
    }

    function toggleOne(id: string, checked: boolean) {
        setSelectedIds(prev => { const s = new Set(prev); checked ? s.add(id) : s.delete(id); return s })
    }


    function updateDraft<K extends keyof ActivityDraft>(id: string, key: K, val: ActivityDraft[K]) {
        setDrafts(prev => ({ ...prev, [id]: { ...prev[id], [key]: val } }))
    }





    const statusCls = {
        neutral: 'border-[var(--color-border)] text-[var(--color-text-muted)]',
        success: 'border-[color:oklch(from_var(--color-success)_l_c_h_/_0.5)] text-[var(--color-success)]',
        error: 'border-[color:oklch(from_var(--color-error)_l_c_h_/_0.5)] text-[var(--color-error)]',
    }[statusTone]

    return (
        <div className="space-y-6 p-6">

            {/* Page header */}
            <header className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
                <h1 className="text-2xl font-bold text-[var(--color-text)]">MET Activity Admin</h1>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                    Import, edit, export and delete documents in your Firestore{' '}
                    <code className="rounded bg-[var(--color-surface-offset)] px-1 py-0.5 text-xs">met</code> collection.
                </p>
            </header>


            <div >

                {/* Left sidebar */}
                <div className="space-y-6">

                    <p className="mb-4 text-sm text-[var(--color-text-muted)]">
                        Expected columns:{' '}
                        <code className="rounded bg-[var(--color-surface-offset)] px-1 py-0.5 text-xs">Major Heading</code>,{' '}
                        <code className="rounded bg-[var(--color-surface-offset)] px-1 py-0.5 text-xs">MET Value</code>, and{' '}
                        <code className="rounded bg-[var(--color-surface-offset)] px-1 py-0.5 text-xs">Activity Description</code>.
                    </p>
                    <div >
                        <label className={`w-full`}>
                            Import CSV
                            <input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden" onChange={handleImport} />
                        </label>
                        <Button type="button" onClick={handleExport} disabled={!activities.length}>
                            Export visible rows
                        </Button>
                        <Button type="button" onClick={() => console.log()} disabled={!selectedIds.size}>
                            Delete selected ({selectedIds.size})
                        </Button>
                        <Button type="button" onClick={() => void fetchActivities()} disabled={loading}>
                            {loading ? 'Loading…' : 'Reload from Firestore'}
                        </Button>
                    </div>
                    <div className={`mt-4 rounded-2xl border p-3 text-sm ${statusCls}`}>{status}</div>



                </div>


                {activities.length > 0 && <div >

                    <div className="grid grid-cols-3 gap-4">
                        <StatCard label="Total rows" value={activities.length} />
                        <StatCard label="Visible rows" value={activities.length} />
                        <StatCard label="Selected rows" value={selectedIds.size} />
                    </div>

                    <>
                        <table className="w-full border-collapse text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 text-left text-xs text-gray-500">
                                    <th className="px-3 py-2"></th>
                                    <th className="px-3 py-2">MET</th>
                                    <th className="px-3 py-2">Main</th>
                                    <th className="px-3 py-2">ActivityDesc</th>
                                    <th className="px-3 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activities.length ? activities.map((activity, index) => {
                                    const draft = { MET: activity.MET, Main: activity.Main, ActivityDesc: activity.ActivityDesc }
                                    const draftId = `${activity.Main}-${index}`
                                    return (
                                        <tr key={draftId} className="border-b border-gray-200 align-top">
                                            <td className="px-3 py-2">
                                                <input type="checkbox" checked={selectedIds.has(draftId)} onChange={e => toggleOne(draftId, e.target.checked)} className="h-4 w-4" />
                                            </td>

                                            <td className="px-3 py-2">
                                                <input type="number" step="0.1" value={draft.MET} onChange={e => updateDraft(draftId, 'MET', Number(e.target.value))} className="w-20 border border-gray-300 rounded px-2 py-1 text-sm" />
                                            </td>
                                            <td className="px-3 py-2">
                                                <input type="text" value={draft.Main} onChange={e => updateDraft(draftId, 'Main', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm" />
                                            </td>
                                            <td className="px-3 py-2">
                                                <input type="text" value={draft.ActivityDesc} onChange={e => updateDraft(activity.id, 'ActivityDesc', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm" />
                                            </td>
                                            <td className="px-3 py-2">
                                                <div className="flex gap-2">
                                                    <Button type="button" variant="danger" className="w-20" onClick={() => console.log(activity.id)} >Delete</Button>
                                                    <Button type="button" variant="continue" className="w-20" onClick={() => { const result = postActivity(activity); alert(result?.message) }} >Save</Button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                }) : (
                                    <tr>
                                        <td colSpan={6} className="px-3 py-10 text-center text-sm text-gray-400">
                                            No activities found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                    </>

                </div>}
            </div>
        </div >
    )
}