
import {
    type Activity,
    type ActivityDraft,
} from "../api/db";
import Button from "../components/Button";

type ActivityManagementTableProps = {
    displayedActivities: Array<Activity>
    postActivity: (activity: ActivityDraft) => any
}

export default function ActivityManagementTable({ displayedActivities, postActivity }: ActivityManagementTableProps) {

    return (
        <div className="overflow-x-auto rounded-[20px] border border-[#F1F1F1] bg-[#FCFCFC]">
            <table className="min-w-full border-separate border-spacing-0">
                <thead>
                    <tr className="bg-[#F7F8F8] text-left">
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
                    {displayedActivities.map((activity, index) => {
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

                                        type="text"
                                        inputMode="decimal"
                                        value={
                                            !draft.MET
                                                ? ""
                                                : parseFloat(draft.MET + "").toPrecision(3)
                                        }
                                        onChange={(e) =>
                                            console.log(
                                                draftId,
                                                "MET",
                                                Number(e.target.value.replace(",", "."))
                                            )
                                        }


                                        className="w-24 rounded-full border border-[#EAE7E7] bg-[#EEE9FF] px-4 py-2 text-sm font-semibold text-[#7B61FF] outline-none transition focus:border-[#7B61FF] focus:bg-white"
                                    />
                                </td>

                                <td className="border-t border-[#F1F1F1] px-4 py-4">
                                    <input
                                        type="text"
                                        value={draft.Main}
                                        onChange={(e) =>
                                            console.log(draftId, "Main", e.target.value)
                                        }
                                        className="w-full rounded-[16px] border border-[#EAE7E7] bg-white px-4 py-3 text-sm font-medium text-[#1D1617] outline-none transition focus:border-[#7B61FF]"
                                    />
                                </td>

                                <td className="border-t border-[#F1F1F1] px-4 py-4">
                                    <input
                                        type="text"
                                        value={draft.ActivityDesc}
                                        onChange={(e) =>
                                            console.log(draftId, "ActivityDesc", e.target.value)
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
                                            onClick={async () => {
                                                const result = await postActivity({
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

    );
}