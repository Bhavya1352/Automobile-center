import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { PACKAGES } from '../data/homeData';
import { cn } from '../lib/cn';

/**
 * Pricing — a comparison, not three floating cards. Columns share a
 * single rule across the top; the recommended column is marked by a
 * solid rail and a change of ground, nothing more.
 */
const Pricing: React.FC = () => (
    <section id="pricing" className="section scroll-mt-20">
        <div className="wrap">

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
                <h2 className="display-lg lg:col-span-6">Service packages</h2>
                <p className="max-w-[58ch] text-[0.9375rem] leading-relaxed text-muted lg:col-span-5 lg:col-start-8 lg:pb-1.5">
                    Prices are for a four-cylinder petrol or diesel saloon and include
                    parts, labour and taxes. We confirm the figure for your car before
                    you commit.
                </p>
            </div>

            <div className="mt-12 grid grid-cols-1 lg:mt-16 lg:grid-cols-3">
                {PACKAGES.map((pkg, i) => (
                    <div
                        key={pkg.name}
                        className={cn(
                            'flex flex-col pb-8 pt-7',
                            // A rail on top: heavy for the recommended column
                            pkg.recommended
                                ? 'border-t-2 border-forest bg-forest-pale px-6 lg:-mt-7 lg:pt-14'
                                : 'border-t border-ink px-0 lg:px-6',
                            // Hairlines between columns, no boxes
                            !pkg.recommended && i > 0 ? 'lg:border-l lg:border-line' : '',
                            !pkg.recommended && i < PACKAGES.length - 1 ? 'lg:border-r lg:border-line' : '',
                            i === 0 ? 'lg:pl-0' : '',
                            i === PACKAGES.length - 1 ? 'lg:pr-0' : '',
                            // Separation on stacked layouts
                            i > 0 ? 'mt-10 lg:mt-0' : '',
                        )}
                    >
                        <div className="flex items-baseline justify-between gap-3">
                            <h3 className="title-lg">{pkg.name}</h3>
                            {pkg.recommended && (
                                <span className="spec-label text-forest">Recommended</span>
                            )}
                        </div>

                        <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
                            {pkg.desc}
                        </p>

                        <p className="mt-7 flex items-baseline gap-1.5">
                            <span className="text-[1.375rem] font-semibold text-ink-soft">₹</span>
                            <span className="stat text-[3rem]">
                                {pkg.price}
                            </span>
                            <span className="ml-1 text-[0.8125rem] text-muted">{pkg.cadence}</span>
                        </p>

                        <ul className="mt-7 flex-1 space-y-2.5">
                            {pkg.features.map(feature => (
                                <li key={feature} className="flex gap-2.5 text-[0.9375rem] leading-snug text-ink-soft">
                                    <Check
                                        size={15}
                                        strokeWidth={2}
                                        className="mt-1 shrink-0 text-forest"
                                        aria-hidden="true"
                                    />
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <Link
                            to="/contact"
                            className={`btn mt-8 w-full ${pkg.recommended ? 'btn-solid' : 'btn-outline'}`}
                        >
                            {pkg.cta}
                        </Link>
                    </div>
                ))}
            </div>

            <p className="mt-10 border-t border-line pt-5 text-[0.8125rem] text-muted">
                Larger engines, SUVs and performance models are priced on inspection.
                Collection and delivery is included within 25 km on Comprehensive and above.
            </p>
        </div>
    </section>
);

export default Pricing;
