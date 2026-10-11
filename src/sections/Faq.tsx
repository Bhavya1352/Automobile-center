import React from 'react';
import { Accordion } from '../components/ui/Accordion';
import { FAQS } from '../data/homeData';

/** FAQ — rules and type only, no card styling. */
const Faq: React.FC = () => (
    <section className="section bg-sand">
        <div className="wrap">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">

                <div className="lg:col-span-4">
                    <h2 className="display-lg">Questions</h2>
                    <p className="mt-5 text-[0.9375rem] leading-relaxed text-muted">
                        Something not covered here? Call the centre on{' '}
                        <a
                            href="tel:+912244881200"
                            className="text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:text-clay-ink hover:decoration-clay"
                        >
                            +91 22 4488 1200
                        </a>
                        {' '}and ask for a service advisor.
                    </p>
                </div>

                <div className="lg:col-span-7 lg:col-start-6">
                    <Accordion items={FAQS} defaultOpen={0} />
                </div>
            </div>
        </div>
    </section>
);

export default Faq;
