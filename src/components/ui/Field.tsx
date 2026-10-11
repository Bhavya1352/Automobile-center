import React, { useId } from 'react';
import { cn } from '../../lib/cn';

interface BaseProps {
    label: string;
    /** Rendered as "(optional)" beside the label. */
    optional?: boolean;
    error?: string;
    /** Supporting text shown under the control when there is no error. */
    hint?: string;
    className?: string;
}

/**
 * Field — label, control and error message, wired together.
 *
 * The label is always a real <label htmlFor>, the error is linked via
 * aria-describedby and announced with role="alert", and the control
 * carries aria-invalid. Placeholders are never used as labels.
 */

type InputProps = BaseProps & React.InputHTMLAttributes<HTMLInputElement> & { as?: 'input' };
type TextareaProps = BaseProps & React.TextareaHTMLAttributes<HTMLTextAreaElement> & { as: 'textarea' };
type SelectProps = BaseProps & React.SelectHTMLAttributes<HTMLSelectElement> & { as: 'select'; children: React.ReactNode };

export type FieldProps = InputProps | TextareaProps | SelectProps;

export const Field = React.forwardRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, FieldProps>(
    function Field({ label, optional, error, hint, className, ...rest }, ref) {
        const reactId = useId();
        const id = rest.id ?? `field-${reactId}`;
        const errorId = `${id}-error`;
        const hintId = `${id}-hint`;
        const describedBy = [error ? errorId : null, hint && !error ? hintId : null]
            .filter(Boolean).join(' ') || undefined;

        const shared = {
            id,
            ref: ref as never,
            'aria-invalid': error ? true : undefined,
            'aria-describedby': describedBy,
            className: cn('field', error && 'border-clay focus:border-clay'),
        };

        const { as, ...controlProps } = rest as FieldProps & { as?: string };

        return (
            <div className={cn('w-full', className)}>
                <label htmlFor={id} className="field-label">
                    {label}
                    {optional && <span className="ml-1 font-normal text-muted">(optional)</span>}
                </label>

                {as === 'textarea' ? (
                    <textarea {...(controlProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} {...shared} />
                ) : as === 'select' ? (
                    <select {...(controlProps as React.SelectHTMLAttributes<HTMLSelectElement>)} {...shared} />
                ) : (
                    <input {...(controlProps as React.InputHTMLAttributes<HTMLInputElement>)} {...shared} />
                )}

                {error ? (
                    <p id={errorId} role="alert" className="mt-1.5 text-[0.8125rem] text-clay-ink">
                        {error}
                    </p>
                ) : hint ? (
                    <p id={hintId} className="mt-1.5 text-[0.8125rem] text-muted">{hint}</p>
                ) : null}
            </div>
        );
    },
);
