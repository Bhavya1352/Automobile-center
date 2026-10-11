import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Closing CTA — the one place the deep green is used at full area.
 * A single statement, one action, one alternative.
 */
const ClosingCta: React.FC = () => (
    <section className="bg-forest">
        <div className="wrap py-16 lg:py-24">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end lg:gap-16">

                <div className="lg:col-span-7">
                    <h2 className="display-lg text-paper">
                        Book the car in,
                        <br className="hidden sm:block" /> or just ask us first.
                    </h2>
                    <p className="mt-5 max-w-[34rem] text-[1.0625rem] leading-relaxed text-paper/70">
                        Same-day slots are usually available for diagnostics. If you are
                        not sure what you need, describe the symptom and we will tell you
                        whether it is urgent.
                    </p>
                </div>

                <div className="lg:col-span-5">
                    <div className="flex flex-wrap items-center gap-4">
                        <Link to="/contact" className="btn btn-on-dark">
                            Book a service
                        </Link>
                        <a
                            href="tel:+912244881200"
                            className="inline-flex items-center gap-2 border-b border-paper/30 pb-0.5 text-[0.9375rem] font-medium text-paper transition-colors hover:border-paper"
                        >
                            +91 22 4488 1200
                        </a>
                    </div>

                    <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-paper/15 pt-6">
                        <div>
                            <dt className="spec-label text-paper/75">Opening hours</dt>
                            <dd className="mt-1 text-[0.9375rem] text-paper/85">
                                Mon–Sat, 8:30–19:00
                            </dd>
                        </div>
                        <div>
                            <dt className="spec-label text-paper/75">Where we are</dt>
                            <dd className="mt-1 text-[0.9375rem] text-paper/85">
                                Andheri East, Mumbai
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    </section>
);

export default ClosingCta;
