import { revalidateLogic, useForm } from "@tanstack/react-form";
import type { AnyFieldApi } from "@tanstack/react-form";
import Button from "../components/Button";
import type { FavoriteWorkout } from "../components/FavoriteWorkoutsField";
import FavoriteWorkoutsField from "../components/FavoriteWorkoutsField";

type LiftingPreference =
    | "powerlifting"
    | "bodybuilding"
    | "general-fitness"
    | "olympic-lifting";

type ProfileFormValues = {
    name: string;
    age: number;
    bodyWeight: number;
    preferredLiftWeight: number;
    liftingPreference: LiftingPreference;
    favoriteWorkouts: FavoriteWorkout[];
};

function FieldInfo({ field }: { field: Pick<AnyFieldApi, "state"> }) {
    const { isTouched, isValid, isValidating, errors } = field.state.meta;

    return (
        <>
            {isTouched && !isValid && (
                <p className="mt-2 text-xs font-medium text-[#FF6B9D]">
                    {errors.join(", ")}
                </p>
            )}
            {isValidating && (
                <p className="mt-2 text-xs text-[#ADA4A5]">Validating...</p>
            )}
        </>
    );
}

const inputClass =
    "w-full rounded-full border border-transparent bg-[#F7F8F8] px-4 py-3 text-sm font-medium text-[#1D1617] placeholder:text-[#ADA4A5] outline-none transition focus:border-[#7B61FF] focus:bg-white focus:ring-4 focus:ring-[rgba(123,97,255,0.10)]";

const labelClass =
    "mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#ADA4A5]";

export default function Settings() {
    const form = useForm<ProfileFormValues>({
        defaultValues: {
            name: "",
            age: 18,
            bodyWeight: 70,
            preferredLiftWeight: 40,
            liftingPreference: "general-fitness",
            favoriteWorkouts: [],
        },
        validationLogic: revalidateLogic(),
        validators: {
            onDynamic: ({ value }) => {
                const errors: Partial<Record<keyof ProfileFormValues, string>> = {};

                if (!value.name.trim()) {
                    errors.name = "Name is required";
                }

                if (!value.age || value.age < 10) {
                    errors.age = "Age must be at least 10";
                }

                if (!value.bodyWeight || value.bodyWeight <= 0) {
                    errors.bodyWeight = "Body weight must be greater than 0";
                }

                if (!value.preferredLiftWeight || value.preferredLiftWeight <= 0) {
                    errors.preferredLiftWeight =
                        "Lifted weight must be greater than 0";
                }

                if (
                    value.bodyWeight > 0 &&
                    value.preferredLiftWeight > 0 &&
                    value.preferredLiftWeight >= value.bodyWeight
                ) {
                    errors.bodyWeight =
                        "Body weight must be higher than lifted weight";
                    errors.preferredLiftWeight =
                        "Lifted weight cannot exceed body weight";
                }

                if (value.favoriteWorkouts.length === 0) {
                    errors.favoriteWorkouts = "Select at least one favorite workout";
                }

                return Object.keys(errors).length ? errors : undefined;
            },
        },
        onSubmit: async ({ value }) => {
            console.log("Profile settings:", value);
        },
    });

    return (
        <div className="mx-auto w-full max-w-5xl space-y-6">
            {/* Header card */}
            <section className="rounded-[28px] bg-white p-6 shadow-[0_8px_30px_rgba(29,22,23,0.06)] sm:p-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,#7B61FF_0%,#C084FC_100%)] text-lg font-semibold text-white shadow-[0_10px_30px_rgba(123,97,255,0.22)]">
                            M
                        </div>

                        <div>
                            <h1 className="text-2xl font-semibold tracking-[-0.03em] text-[#1D1617]">
                                Profile Settings
                            </h1>
                            <p className="mt-1 text-sm text-[#ADA4A5]">
                                Update your details, lifting preferences, and favorite workouts.
                            </p>
                        </div>
                    </div>

                    <div className="inline-flex items-center rounded-full bg-[linear-gradient(135deg,#7B61FF_0%,#C084FC_100%)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(123,97,255,0.24)]">
                        Edit Profile
                    </div>
                </div>
            </section>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    void form.handleSubmit();
                }}
                className="space-y-6"
            >
                {/* Summary tiles */}
                <form.Subscribe
                    selector={(state) => [state.values] as const}
                >
                    {([values]) => (
                        <section className="grid gap-4 sm:grid-cols-3">
                            <div className="rounded-[20px] bg-white px-5 py-5 text-center shadow-[0_8px_30px_rgba(29,22,23,0.05)]">
                                <p className="text-2xl font-semibold leading-none text-[#C084FC]">
                                    {values.age || "—"}
                                </p>
                                <p className="mt-2 text-sm text-[#ADA4A5]">Age</p>
                            </div>

                            <div className="rounded-[20px] bg-white px-5 py-5 text-center shadow-[0_8px_30px_rgba(29,22,23,0.05)]">
                                <p className="text-2xl font-semibold leading-none text-[#C084FC]">
                                    {values.bodyWeight || "—"}
                                    <span className="ml-1 text-sm font-medium">kg</span>
                                </p>
                                <p className="mt-2 text-sm text-[#ADA4A5]">Body Weight</p>
                            </div>

                            <div className="rounded-[20px] bg-white px-5 py-5 text-center shadow-[0_8px_30px_rgba(29,22,23,0.05)]">
                                <p className="text-2xl font-semibold leading-none text-[#C084FC]">
                                    {values.preferredLiftWeight || "—"}
                                    <span className="ml-1 text-sm font-medium">kg</span>
                                </p>
                                <p className="mt-2 text-sm text-[#ADA4A5]">Lift Weight</p>
                            </div>
                        </section>
                    )}
                </form.Subscribe>

                {/* Main form card */}
                <section className="rounded-[28px] bg-white p-6 shadow-[0_8px_30px_rgba(29,22,23,0.06)] sm:p-8">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-[#1D1617]">
                            Personal Data
                        </h2>
                        <p className="mt-1 text-sm text-[#ADA4A5]">
                            Keep your profile accurate for better recommendations.
                        </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        <form.Field name="name">
                            {(field) => (
                                <div>
                                    <label htmlFor={field.name} className={labelClass}>
                                        Name
                                    </label>
                                    <input
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder="John Doe"
                                        className={inputClass}
                                    />
                                    <FieldInfo field={field} />
                                </div>
                            )}
                        </form.Field>

                        <form.Field name="age">
                            {(field) => (
                                <div>
                                    <label htmlFor={field.name} className={labelClass}>
                                        Age
                                    </label>
                                    <input
                                        id={field.name}
                                        name={field.name}
                                        type="number"
                                        min={10}
                                        value={field.state.value || ""}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                                        className={inputClass}
                                    />
                                    <FieldInfo field={field} />
                                </div>
                            )}
                        </form.Field>

                        <form.Field name="bodyWeight">
                            {(field) => (
                                <div>
                                    <label htmlFor={field.name} className={labelClass}>
                                        Body Weight (kg)
                                    </label>
                                    <input
                                        id={field.name}
                                        name={field.name}
                                        type="number"
                                        min={1}
                                        step={0.1}
                                        value={field.state.value || ""}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                                        className={inputClass}
                                    />
                                    <FieldInfo field={field} />
                                </div>
                            )}
                        </form.Field>

                        <form.Field name="preferredLiftWeight">
                            {(field) => (
                                <div>
                                    <label htmlFor={field.name} className={labelClass}>
                                        Weight Lifted (kg)
                                    </label>
                                    <input
                                        id={field.name}
                                        name={field.name}
                                        type="number"
                                        min={1}
                                        step={0.1}
                                        value={field.state.value || ""}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                                        className={inputClass}
                                    />
                                    <FieldInfo field={field} />
                                </div>
                            )}
                        </form.Field>
                    </div>
                </section>

                {/* Preference card */}
                <section className="rounded-[28px] bg-white p-6 shadow-[0_8px_30px_rgba(29,22,23,0.06)] sm:p-8">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-[#1D1617]">
                            Training Style
                        </h2>
                        <p className="mt-1 text-sm text-[#ADA4A5]">
                            Set your preferred lifting approach and saved workout types.
                        </p>
                    </div>

                    <div className="space-y-5">
                        <form.Field name="liftingPreference">
                            {(field) => (
                                <div>
                                    <label htmlFor={field.name} className={labelClass}>
                                        Lifting Preference
                                    </label>
                                    <select
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) =>
                                            field.handleChange(e.target.value as LiftingPreference)
                                        }
                                        className={inputClass}
                                    >
                                        <option value="general-fitness">General Fitness</option>
                                        <option value="bodybuilding">Bodybuilding</option>
                                        <option value="powerlifting">Powerlifting</option>
                                        <option value="olympic-lifting">Olympic Lifting</option>
                                    </select>
                                    <FieldInfo field={field} />
                                </div>
                            )}
                        </form.Field>

                        <form.Field name="favoriteWorkouts">
                            {(field) => <FavoriteWorkoutsField field={field} form={form} />}
                        </form.Field>
                    </div>
                </section>

                {/* Preview card */}
                <form.Subscribe
                    selector={(state) =>
                        [state.canSubmit, state.isSubmitting, state.values] as const
                    }
                >
                    {([canSubmit, isSubmitting, values]) => {
                        const invalidWeightRelation =
                            values.preferredLiftWeight >= values.bodyWeight;

                        return (
                            <>
                                <section className="rounded-[28px] bg-white p-6 shadow-[0_8px_30px_rgba(29,22,23,0.06)] sm:p-8">
                                    <div className="mb-5">
                                        <h2 className="text-xl font-semibold text-[#1D1617]">
                                            Live Preview
                                        </h2>
                                        <p className="mt-1 text-sm text-[#ADA4A5]">
                                            See how your current profile information looks.
                                        </p>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="rounded-[20px] bg-[#F7F8F8] px-5 py-4">
                                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#ADA4A5]">
                                                Name
                                            </p>
                                            <p className="mt-2 text-base font-semibold text-[#1D1617]">
                                                {values.name || "—"}
                                            </p>
                                        </div>

                                        <div className="rounded-[20px] bg-[#F7F8F8] px-5 py-4">
                                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#ADA4A5]">
                                                Preference
                                            </p>
                                            <p className="mt-2 text-base font-semibold text-[#1D1617]">
                                                {values.liftingPreference}
                                            </p>
                                        </div>

                                        <div className="rounded-[20px] bg-[#F7F8F8] px-5 py-4">
                                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#ADA4A5]">
                                                Body Weight
                                            </p>
                                            <p className="mt-2 text-base font-semibold text-[#1D1617]">
                                                {values.bodyWeight || "—"} kg
                                            </p>
                                        </div>

                                        <div className="rounded-[20px] bg-[#F7F8F8] px-5 py-4">
                                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#ADA4A5]">
                                                Weight Lifted
                                            </p>
                                            <p className="mt-2 text-base font-semibold text-[#1D1617]">
                                                {values.preferredLiftWeight || "—"} kg
                                            </p>
                                        </div>

                                        <div className="rounded-[20px] bg-[#F7F8F8] px-5 py-4 sm:col-span-2">
                                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#ADA4A5]">
                                                Favorite Workouts
                                            </p>
                                            <p className="mt-2 text-base font-semibold text-[#1D1617]">
                                                {values.favoriteWorkouts.length
                                                    ? values.favoriteWorkouts.join(", ")
                                                    : "—"}
                                            </p>
                                        </div>
                                    </div>

                                    {invalidWeightRelation && (
                                        <div className="mt-5 rounded-[20px] border border-[#FFD4E0] bg-[#FFF1F4] px-5 py-4">
                                            <h3 className="text-sm font-semibold text-[#FF6B9D]">
                                                Issues
                                            </h3>
                                            <p className="mt-2 text-sm text-[#FF6B9D]">
                                                Weight lifted cannot be higher than body weight.
                                            </p>
                                        </div>
                                    )}
                                </section>

                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        disabled={!canSubmit || isSubmitting}
                                        className="sm:flex-1"
                                    >
                                        {isSubmitting ? "Saving..." : "Save Settings"}
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => form.reset()}
                                        className="md:w-40 sm:min-w-[160px]"
                                    >
                                        Reset
                                    </Button>
                                </div>
                            </>
                        );
                    }}
                </form.Subscribe>
            </form>
        </div>
    );
}