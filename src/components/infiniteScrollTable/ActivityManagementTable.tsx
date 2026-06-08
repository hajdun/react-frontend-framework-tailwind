import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    type ColumnDef,
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

const INITIAL_COUNT = 12;
const LOAD_MORE_COUNT = 10;

function parseMetInput(value: string) {
    const parsed = Number(value.replace(",", "."));
    return Number.isNaN(parsed) ? 0 : parsed;
}


export default function ActivityManagementTable({
    displayedActivities,
    postActivity,
    deleteActivity,
}: ActivityManagementTableProps) {
    const [rows, setRows] = useState<ActivityRow[]>(displayedActivities);
    const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        setRows(displayedActivities);
        setVisibleCount(INITIAL_COUNT);
    }, [displayedActivities]);

    const hasMore = visibleCount < rows.length;

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

    const loadMore = useCallback(() => {
        if (!hasMore || isLoadingMore) return;

        setIsLoadingMore(true);

        window.setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + LOAD_MORE_COUNT, rows.length));
            setIsLoadingMore(false);
        }, 250);
    }, [hasMore, isLoadingMore, rows.length]);

    const sentinelRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }

            observerRef.current = new IntersectionObserver(
                (entries) => {
                    if (entries[0]?.isIntersecting && hasMore && !isLoadingMore) {
                        loadMore();
                    }
                },
                {
                    root: null,
                    rootMargin: "120px",
                    threshold: 0.1,
                }
            );

            if (node) {
                observerRef.current.observe(node);
            }
        },
        [hasMore, isLoadingMore, loadMore]
    );

    const visibleRows = useMemo(
        () => rows.slice(0, visibleCount),
        [rows, visibleCount]
    );

    const columns = useMemo<ColumnDef<ActivityRow>[]>(
        () => [
            columnHelper.accessor("MET", {
                header: () => "MET",
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
                header: () => "Main heading",
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
                header: () => "Activity description",
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
        data: visibleRows,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="space-y-4">
            <div className="overflow-hidden rounded-[24px] border border-[#F1F1F1] bg-[#FCFCFC] shadow-[0_12px_30px_rgba(29,22,23,0.04)]">
                <div className="overflow-x-auto">
                    <table className="min-w-full border-separate border-spacing-0">
                        <thead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id} className="bg-[#F7F8F8] text-left">
                                    {headerGroup.headers.map((header, index) => (
                                        <th
                                            key={header.id}
                                            className={`px-4 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#ADA4A5] ${index === headerGroup.headers.length - 1
                                                ? "rounded-tr-[24px]"
                                                : ""
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

                            {visibleRows.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                        className="border-t border-[#F1F1F1] px-4 py-10 text-center text-sm text-[#ADA4A5]"
                                    >
                                        No activities found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex flex-col items-center gap-3">
                <div className="text-sm text-[#7B6F72]">
                    Showing{" "}
                    <span className="font-semibold text-[#1D1617]">{visibleRows.length}</span>
                    {" "}of{" "}
                    <span className="font-semibold text-[#1D1617]">{rows.length}</span>
                    {" "}activities
                </div>

                {hasMore && (
                    <>
                        <div ref={sentinelRef} className="h-6 w-full" />

                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={loadMore}
                            disabled={isLoadingMore}
                        >
                            {isLoadingMore ? "Loading..." : "Load more"}
                        </Button>
                    </>
                )}

                {!hasMore && rows.length > 0 && (
                    <p className="text-sm text-[#ADA4A5]">You’ve reached the end of the list.</p>
                )}
            </div>
        </div>
    );
}