import React, { useId, useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { cn } from '../../lib/cn';

export interface AccordionItem {
    q: string;
    a: string;
}

interface AccordionProps {
    items: AccordionItem[];
    /** Index open on first render; null for all closed. */
    defaultOpen?: number | null;
    /** Visual treatment: hairline rules, or bordered panels. */
    variant?: 'rules' | 'panel';
    className?: string;
}

/**
 * Accordion — one panel open at a time.
 *
 * Built as a description list: each question is a <button> inside a
 * <dt> with aria-expanded and aria-controls, each answer a <dd> that is
 * genuinely hidden when closed, so it is skipped by screen readers and
 * find-in-page rather than merely clipped.
 */
export const Accordion: React.FC<AccordionProps> = ({
    items,
    defaultOpen = null,
    variant = 'rules',
    className,
}) => {
    const [open, setOpen] = useState<number | null>(defaultOpen);
    const baseId = useId();

    return (
        <dl className={cn(variant === 'rules' && 'border-t border-ink', className)}>
            {items.map((item, i) => {
                const isOpen = open === i;
                const questionId = `${baseId}-q-${i}`;
                const answerId = `${baseId}-a-${i}`;

                return (
                    <div
                        key={item.q}
                        className={cn(
                            variant === 'rules' && 'border-b border-line',
                            variant === 'panel' && cn('panel mb-3', isOpen ? 'border-forest' : 'border-line'),
                        )}
                    >
                        <dt>
                            <button
                                type="button"
                                id={questionId}
                                aria-expanded={isOpen}
                                aria-controls={answerId}
                                onClick={() => setOpen(isOpen ? null : i)}
                                className={cn(
                                    'flex w-full items-start justify-between gap-6 text-left',
                                    variant === 'rules' ? 'py-5' : 'p-5',
                                )}
                            >
                                <span className="text-[1.0625rem] font-semibold leading-snug tracking-[-0.012em] text-ink sm:text-[1.125rem]">
                                    {item.q}
                                </span>
                                <span className="mt-1 shrink-0 text-muted" aria-hidden="true">
                                    {isOpen ? <Minus size={18} strokeWidth={1.5} /> : <Plus size={18} strokeWidth={1.5} />}
                                </span>
                            </button>
                        </dt>
                        <dd
                            id={answerId}
                            aria-labelledby={questionId}
                            hidden={!isOpen}
                            className={cn(
                                'text-[0.9375rem] leading-relaxed text-muted',
                                variant === 'rules' ? 'pb-6 pr-10' : 'px-5 pb-5',
                            )}
                        >
                            {item.a}
                        </dd>
                    </div>
                );
            })}
        </dl>
    );
};
