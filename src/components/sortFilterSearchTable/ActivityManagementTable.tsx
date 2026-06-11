import { useEffect, useMemo, useState } from "react";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
} from "@tanstack/react-table";
import type { Activity, ActivityDraft } from "../../api/db";
import Button from "../../components/Button";

type ActivityManagementTableProps = {
    displayedActivities: Activity[];
    postActivity: (activity: ActivityDraft) => Promise<{ message?: string } | void>;
    deleteActivity?: (id: string) => void | Promise<void>;
};

type ActivityRow = Activity & {
    isDirty?: boolean;
};

const columnHelper = createColumnHelper<ActivityRow>();

function parseMetInput(value: string) {
    const parsed = Number(value.replace(",", "."));
    return Number.isNaN(parsed) ? 0 : parsed;
}

function formatMet(value: number) {
    if (!value) return "";
    return parseFloat(String(value)).toPrecision(3).replace(".", ",");
}

export default function ActivityManagementTable({
    displayedActivities,
    postActivity,
    deleteActivity,
}: ActivityManagementTableProps) {
    const [rows, setRows] = useState<ActivityRow[]>(displayedActivities);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState("");

    useEffect(() => {
        setRows(displayedActivities);
    }, [displayedActivities]);

    const updateRow = <K extends keyof ActivityDraft>(
        rowId: string,
        key: K,
        value: ActivityDraft[K]
    ) => {
        setRows((prev) =>
            prev.map((row) =>
                row.id === rowId
                    ? {
                        ...row,
                        [key]: value,
                        isDirty: true,
                    }
                    : row
            )
        );
    };

    const columns = useMemo<ColumnDef<ActivityRow>[]>(
        () => [
            columnHelper.accessor("MET", {
                header: ({ column }) => (
                    <button
                        type="button"
                        onClick={column.getToggleSortingHandler()}
                        className="inline-flex items-center gap-1 text-left"
                    >
                        MET
                        <span className="text-[10px] text-[#C0B8B9]">
                            {column.getIsSorted() === "asc"
                                ? "↑"
                                : column.getIsSorted() === "desc"
                                    ? "↓"
                                    : "↕"}
                        </span>
                    </button>
                ),
                sortingFn: "basic",
                cell: ({ row, getValue }) => (
                    <input
                        type="text"
                        inputMode="decimal"
                        value={
                            !getValue()
                                ? ""
                                : parseFloat(getValue() + "").toPrecision(3)
                        }
                        onChange={(e) =>
                            updateRow(row.original.id, "MET", parseMetInput(e.target.value))
                        }
                        className="w-24 rounded-full border border-[#EAE7E7] bg-[#EEE9FF] px-4 py-2 text-sm font-semibold text-[#7B61FF] outline-none transition focus:border-[#7B61FF] focus:bg-white"
                    />
                ),
            }),

            columnHelper.accessor("Main", {
                header: ({ column }) => (
                    <button
                        type="button"
                        onClick={column.getToggleSortingHandler()}
                        className="inline-flex items-center gap-1 text-left"
                    >
                        Main heading
                        <span className="text-[10px] text-[#C0B8B9]">
                            {column.getIsSorted() === "asc"
                                ? "↑"
                                : column.getIsSorted() === "desc"
                                    ? "↓"
                                    : "↕"}
                        </span>
                    </button>
                ),
                filterFn: "includesString",
                cell: ({ row, getValue }) => (
                    <input
                        type="text"
                        value={getValue()}
                        onChange={(e) => updateRow(row.original.id, "Main", e.target.value)}
                        className="w-full rounded-[16px] border border-[#EAE7E7] bg-white px-4 py-3 text-sm font-medium text-[#1D1617] outline-none transition focus:border-[#7B61FF]"
                    />
                ),
            }),

            columnHelper.accessor("ActivityDesc", {
                header: ({ column }) => (
                    <button
                        type="button"
                        onClick={column.getToggleSortingHandler()}
                        className="inline-flex items-center gap-1 text-left"
                    >
                        Activity description
                        <span className="text-[10px] text-[#C0B8B9]">
                            {column.getIsSorted() === "asc"
                                ? "↑"
                                : column.getIsSorted() === "desc"
                                    ? "↓"
                                    : "↕"}
                        </span>
                    </button>
                ),
                filterFn: "includesString",
                cell: ({ row, getValue }) => (
                    <input
                        type="text"
                        value={getValue()}
                        onChange={(e) =>
                            updateRow(row.original.id, "ActivityDesc", e.target.value)
                        }
                        className="w-full rounded-[16px] border border-[#EAE7E7] bg-white px-4 py-3 text-sm font-medium text-[#1D1617] outline-none transition focus:border-[#7B61FF]"
                    />
                ),
            }),

            columnHelper.display({
                id: "actions",
                header: () => "Actions",
                enableSorting: false,
                cell: ({ row }) => {
                    const { id, MET, Main, ActivityDesc, isDirty } = row.original;

                    return (
                        <div className="flex flex-wrap gap-2">
                            <Button
                                type="button"
                                variant="danger"
                                size="sm"
                                className="min-w-[88px]"
                                onClick={() => deleteActivity?.(id)}
                            >
                                Delete
                            </Button>

                            <Button
                                type="button"
                                variant="primary"
                                size="sm"
                                className="min-w-[88px]"
                                disabled={!isDirty}
                                onClick={async () => {
                                    const result = await postActivity({
                                        MET,
                                        Main,
                                        ActivityDesc,
                                    });

                                    setRows((prev) =>
                                        prev.map((item) =>
                                            item.id === id ? { ...item, isDirty: false } : item
                                        )
                                    );

                                    if (result?.message) alert(result.message);
                                }}
                            >
                                Save
                            </Button>
                        </div>
                    );
                },
            }),
        ],
        [deleteActivity, postActivity]
    );

    const table = useReactTable({
        data: rows,
        columns,
        state: {
            sorting,
            columnFilters,
            globalFilter,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: "includesString",
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 rounded-[24px] border border-[#F1F1F1] bg-white p-4 shadow-[0_12px_30px_rgba(29,22,23,0.04)]">
                <div className="grid gap-3 md:grid-cols-3">
                    <input
                        type="text"
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Search in all columns..."
                        className="rounded-[16px] border border-[#EAE7E7] bg-[#FCFCFC] px-4 py-3 text-sm text-[#1D1617] outline-none transition focus:border-[#7B61FF]"
                    />

                    <input
                        type="text"
                        value={(table.getColumn("Main")?.getFilterValue() as string) ?? ""}
                        onChange={(e) => table.getColumn("Main")?.setFilterValue(e.target.value)}
                        placeholder="Filter main heading..."
                        className="rounded-[16px] border border-[#EAE7E7] bg-[#FCFCFC] px-4 py-3 text-sm text-[#1D1617] outline-none transition focus:border-[#7B61FF]"
                    />

                    <input
                        type="text"
                        value={(table.getColumn("ActivityDesc")?.getFilterValue() as string) ?? ""}
                        onChange={(e) =>
                            table.getColumn("ActivityDesc")?.setFilterValue(e.target.value)
                        }
                        placeholder="Filter description..."
                        className="rounded-[16px] border border-[#EAE7E7] bg-[#FCFCFC] px-4 py-3 text-sm text-[#1D1617] outline-none transition focus:border-[#7B61FF]"
                    />
                </div>

                <div className="text-sm text-[#7B6F72]">
                    Results:{" "}
                    <span className="font-semibold text-[#1D1617]">
                        {table.getFilteredRowModel().rows.length}
                    </span>
                </div>
            </div>

            <div className="overflow-hidden rounded-[24px] border border-[#F1F1F1] bg-[#FCFCFC] shadow-[0_12px_30px_rgba(29,22,23,0.04)]">
                <div className="overflow-x-auto">
                    <table className="min-w-full border-separate border-spacing-0">
                        <thead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id} className="bg-[#F7F8F8] text-left">
                                    {headerGroup.headers.map((header, index) => (
                                        <th
                                            key={header.id}
                                            className={`px-4 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#ADA4A5] ${index === headerGroup.headers.length - 1 ? "rounded-tr-[24px]" : ""
                                                } ${index === 0 ? "rounded-tl-[24px]" : ""}`}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>

                        <tbody>
                            {table.getRowModel().rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className="align-top transition-colors hover:bg-white/80"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            className="border-t border-[#F1F1F1] px-4 py-4"
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}

                            {table.getRowModel().rows.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                        className="border-t border-[#F1F1F1] px-4 py-10 text-center text-sm text-[#ADA4A5]"
                                    >
                                        No matching activities found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}