import Papa from 'papaparse';


import type { Activity, ActivityDraft } from "../api/db"






export function toCsv(rows: Activity[]): string {
    const escape = (v: unknown) => {
        const s = String(v ?? '')
        return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
    }
    return [['id', 'MET', 'Main', 'ActivityDesc'], ...rows.map(r => [r.id, r.MET, r.Main, r.ActivityDesc])]
        .map(row => row.map(escape).join(','))
        .join('\n')
}




export function parseCsv(file: any) {

    const result = Papa.parse(file, { delimiter: ";" });
    const resultData = result.data

    const parsedResult = (resultData || []).map((rd: string[]) => {
        return {
            Main: rd[0], MET: rd[1], ActivityDesc: rd[2]
        }
    }
    )

    return parsedResult
}

