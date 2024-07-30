import { useState } from "react";

export function useErrorList () {
    const [errors, setErrors] = useState<string[]>([]);

    const render = () => (
        <ErrorList errors={errors} clearErrors={() => setErrors([])} />
    );

    return { errors, setErrors, ErrorList: render };
}

export interface ErrorListProps {
    errors: string[]
    clearErrors: () => void
}

export function ErrorList ({ errors, clearErrors }: ErrorListProps) {
    return errors && errors.length > 0 && (
        <div className="bg-red-600 p-2 rounded-md relative">
            <button
                type="button"
                className="absolute top-0 right-0 px-2"
                onClick={() => clearErrors()}
            >
                &times;
            </button>
            {errors.map((message, i) =>
                <p key={i}>{message}</p>
            )}
        </div>
    )
}
