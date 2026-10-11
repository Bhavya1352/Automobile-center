import React from 'react';
import { TESTIMONIALS } from '../data/homeData';
import { cn } from '../lib/cn';

/**
 * Testimonials — three accounts of specific jobs on specific cars.
 * Set as editorial quotations separated by rules. No star ratings,
 * no avatars, no cards.
 */
const Testimonials: React.FC = () => (
    <section className="section-tight pb-16 lg:pb-24">
        <div className="wrap">
            <h2 className="display-md border-b border-ink pb-6">
                What owners say
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3">
                {TESTIMONIALS.map((t, i) => (
                    <figure
                        key={t.name}
                        className={cn(
                            'flex flex-col border-b border-line py-8 lg:border-b-0 lg:py-10',
                            'lg:border-l lg:border-line lg:px-8',
                            i === 0 ? 'lg:border-l-0 lg:pl-0' : '',
                            i === TESTIMONIALS.length - 1 ? 'lg:pr-0' : '',
                        )}
                    >
                        {/* Capped measure: stacked at 768px these ran to about
                            95 characters a line. */}
                        <blockquote className="max-w-[62ch] flex-1 text-[1.0625rem] font-normal leading-[1.62] text-ink-soft lg:max-w-none">
                            &ldquo;{t.quote}&rdquo;
                        </blockquote>

                        <figcaption className="mt-6">
                            <span className="block text-[0.9375rem] font-semibold text-ink">
                                {t.name}
                            </span>
                            <span className="mt-1 block text-[0.75rem] font-medium text-muted">
                                {t.vehicle}
                            </span>
                            <span className="mt-0.5 block text-[0.75rem] font-semibold text-clay-ink">
                                {t.service}
                            </span>
                        </figcaption>
                    </figure>
                ))}
            </div>
        </div>
    </section>
);

export default Testimonials;
