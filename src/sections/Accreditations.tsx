import React from 'react';
import { ACCREDITATIONS } from '../data/homeData';

/**
 * Accreditations — a quiet band of wordmarks set as type, not a
 * grid of logo tiles. Scrolls on narrow screens, sits still on wide.
 */
const Accreditations: React.FC = () => (
    <section className="border-y border-line bg-sand" aria-label="Accreditations and parts partners">
        <div className="wrap py-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-10">
                <p className="spec-label shrink-0 lg:w-48">Approved &amp; supplied by</p>
                <ul className="flex flex-wrap gap-x-8 gap-y-3 lg:gap-x-10">
                    {ACCREDITATIONS.map(name => (
                        <li
                            key={name}
                            className="text-[0.8125rem] font-semibold tracking-[0.03em] text-faint"
                        >
                            {name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </section>
);

export default Accreditations;
