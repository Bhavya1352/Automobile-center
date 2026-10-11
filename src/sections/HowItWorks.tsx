import React from 'react';
import { STEPS } from '../data/homeData';
import { cn } from '../lib/cn';

/**
 * How it works — four steps set as an editorial sequence. Numerals
 * carry the rhythm; a single rule runs across the top of the row.
 * No icons, no boxes.
 */
const HowItWorks: React.FC = () => (
    <section id="how-it-works" className="section scroll-mt-20 bg-sand">
        <div className="wrap">

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
                <h2 className="display-lg lg:col-span-6">
                    How a service runs
                </h2>
                <p className="max-w-[58ch] text-[0.9375rem] leading-relaxed text-muted lg:col-span-5 lg:col-start-8 lg:pb-1.5">
                    The same four stages whether you are booking an oil change or a
                    gearbox rebuild. You are told the price before stage three.
                </p>
            </div>

            <ol className="mt-12 grid grid-cols-1 border-t border-ink sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
                {STEPS.map((step, i) => (
                    <li
                        key={step.num}
                        className={cn(
                            'border-b border-line py-8 lg:border-b-0 lg:py-10',
                            'lg:border-l lg:border-line lg:px-7',
                            i === 0 ? 'lg:border-l-0 lg:pl-0' : '',
                            i % 2 === 1 ? 'sm:border-l sm:border-line sm:pl-7 lg:pl-7' : '',
                            i === 3 ? 'lg:pr-0' : '',
                        )}
                    >
                        <span className="text-[0.8125rem] font-bold tabular-nums tracking-[0.02em] text-ink-soft">
                            {step.num}
                        </span>
                        <h3 className="title-lg mt-3">{step.title}</h3>
                        <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-muted">
                            {step.desc}
                        </p>
                    </li>
                ))}
            </ol>
        </div>
    </section>
);

export default HowItWorks;
