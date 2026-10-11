import { useCallback, useRef, useState } from 'react';
import { hasErrors } from '../lib/validation';
import type { FieldErrors, Validator } from '../lib/validation';

export type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

interface UseFormOptions<T> {
    initialValues: T;
    validate: Validator<T>;
    onSubmit: (values: T) => Promise<void>;
}

/**
 * Minimal form controller: values, per-field errors, touched tracking
 * and submission status.
 *
 * Errors surface on blur and after a submit attempt, never while the
 * user is still typing a field for the first time — validating on every
 * keystroke tells people they are wrong before they have finished.
 */
export function useForm<T extends Record<keyof T, string | boolean>>({
    initialValues,
    validate,
    onSubmit,
}: UseFormOptions<T>) {
    const [values, setValues] = useState<T>(initialValues);
    const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
    const [submitAttempted, setSubmitAttempted] = useState(false);
    const [status, setStatus] = useState<SubmitStatus>('idle');
    const [submitError, setSubmitError] = useState<string | null>(null);

    const allErrors: FieldErrors<T> = validate(values);

    /** Only show a field's error once the user has left it, or tried to submit. */
    const visibleErrors: FieldErrors<T> = {};
    for (const key of Object.keys(allErrors) as (keyof T)[]) {
        if (submitAttempted || touched[key]) visibleErrors[key] = allErrors[key];
    }

    /** Attach to the <form>; used to find the first invalid control. */
    const formRef = useRef<HTMLFormElement>(null);

    const setValue = useCallback(<K extends keyof T>(name: K, value: T[K]) => {
        setValues(prev => ({ ...prev, [name]: value }) as T);
        setStatus(prev => (prev === 'success' || prev === 'error' ? 'idle' : prev));
    }, []);

    const handleChange = useCallback((
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
        const target = e.target;
        const next = target instanceof HTMLInputElement && target.type === 'checkbox'
            ? target.checked
            : target.value;
        setValues(prev => ({ ...prev, [target.name]: next }) as T);
        setStatus(prev => (prev === 'success' || prev === 'error' ? 'idle' : prev));
    }, []);

    const handleBlur = useCallback((
        e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
        const { name } = e.target;
        setTouched(prev => (prev[name as keyof T] ? prev : { ...prev, [name]: true }));
    }, []);

    const reset = useCallback(() => {
        setValues(initialValues);
        setTouched({});
        setSubmitAttempted(false);
        setStatus('idle');
        setSubmitError(null);
    }, [initialValues]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitAttempted(true);
        setSubmitError(null);

        if (hasErrors(validate(values))) {
            // Move focus to the first field in error so keyboard and
            // screen-reader users are not left guessing what failed.
            // Deferred by a frame: aria-invalid is only applied once the
            // re-render triggered by setSubmitAttempted has committed.
            requestAnimationFrame(() => {
                formRef.current
                    ?.querySelector<HTMLElement>('[aria-invalid="true"]')
                    ?.focus();
            });
            return;
        }

        setStatus('submitting');
        try {
            await onSubmit(values);
            setStatus('success');
        } catch (err) {
            setStatus('error');
            setSubmitError(
                err instanceof Error ? err.message : 'Something went wrong. Please try again.',
            );
        }
    }, [validate, values, onSubmit]);

    return {
        values,
        errors: visibleErrors,
        isValid: !hasErrors(allErrors),
        status,
        submitError,
        formRef,
        setValue,
        handleChange,
        handleBlur,
        handleSubmit,
        reset,
    };
}
