

import { revalidateLogic, useForm } from '@tanstack/react-form'


type FieldInfoProps = {
    field: { state: { meta: { isValidating: boolean, isTouched: boolean, isValid: boolean, errors: any[] } } }
}

export function FieldInfo({ field }: FieldInfoProps) {
    return (
        <>
            {field.state.meta.isTouched && !field.state.meta.isValid ? (
                <em style={{ color: "red" }}>{field.state.meta.errors.join(',')}</em>
            ) : null}
            {field.state.meta.isValidating ? 'Validating...' : null}
        </>
    )
}

export default function Form() {
    const form = useForm({
        defaultValues: {
            firstName: '',
            lastName: '',
            age: 0,
        },
        // If this is omitted, `onDynamic` will not be called
        validationLogic: revalidateLogic(),
        validators: {
            onDynamic: ({ value }) => {
                if (!value.firstName) {
                    return { firstName: 'A first name is required' }
                }
                if (value.age < 13) {
                    return { age: 'Way too young' }
                }
                return undefined
            },
        },
        onSubmit: async ({ value }) => {
            // Do something with form data
            console.log(value)
        },
    })

    return (
        <div>
            <h1>Simple Form Example</h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    form.handleSubmit()
                }}
            >
                <div>
                    {/* A type-safe field component*/}
                    <form.Field
                        name="firstName"
                        validators={{
                            onChange: ({ value }) =>
                                !value
                                    ? 'A first name is required'
                                    : value.length < 3
                                        ? 'First name must be at least 3 characters'
                                        : undefined,
                            onChangeAsyncDebounceMs: 500,
                            onChangeAsync: async ({ value }) => {
                                await new Promise((resolve) => setTimeout(resolve, 1000))
                                return (
                                    value.includes('error') && 'No "error" allowed in first name'
                                )
                            },
                        }}
                        children={(field) => {
                            // Avoid hasty abstractions. Render props are great!
                            return (
                                <>
                                    <label htmlFor={field.name}>First Name:</label>
                                    <input
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                    <FieldInfo field={field} />
                                </>
                            )
                        }}
                    />
                </div>
                <div>
                    <form.Field
                        name="lastName"
                        children={(field) => (
                            <>
                                <label htmlFor={field.name}>Last Name:</label>
                                <input
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                />
                                <FieldInfo field={field} />
                            </>
                        )}
                    />

                    <form.Field
                        name="age"
                        validators={{
                            onChange: ({ value }) =>
                                value < 13 ? 'You must be 13 to make an account' : undefined,
                        }}
                    >
                        {(field) => (
                            <>
                                <label htmlFor={field.name}>Age:</label>
                                <input
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    type="number"
                                    onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                                />
                                {!field.state.meta.isValid && (
                                    <em role="alert" style={{ color: "red" }}>{field.state.meta.errors.join(', ')}</em>
                                )}

                            </>
                        )}
                    </form.Field>
                </div>
                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                    children={([canSubmit, isSubmitting]) => (
                        <>
                            <button type="submit" disabled={!canSubmit}>
                                {isSubmitting ? '...' : 'Submit'}
                            </button>
                            <button
                                type="reset"
                                onClick={(e) => {
                                    // Avoid unexpected resets of form elements (especially <select> elements)
                                    e.preventDefault()
                                    form.reset()
                                }}
                            >
                                Reset
                            </button>
                        </>
                    )}
                />
            </form>
        </div>
    )
}

