import React from 'react';
import { Link } from 'react-router-dom';
import { FEATURED_SERVICE, SERVICES } from '../data/homeData';

/**
 * Services — one featured service carries the section, two mid-weight
 * services follow with photography, and three run as a plain typographic
 * list. Deliberately unequal: the hierarchy tells you where to look.
 */
const Services: React.FC = () => {
    const [midA, midB, ...rest] = SERVICES;

    return (
        <section id="services" className="section scroll-mt-20">
            <div className="wrap">

                {/* Section head — asymmetric, heading left, context right */}
                <div className="grid grid-cols-1 gap-6 border-b border-ink pb-7 lg:grid-cols-12 lg:items-end lg:gap-10">
                    <h2 className="display-lg lg:col-span-7">What we do</h2>
                    <p className="max-w-[58ch] text-[0.9375rem] leading-relaxed text-muted lg:col-span-5 lg:pb-1.5">
                        Six service lines, run out of four bays. We do not take on
                        bodywork or insurance claims — the things we do, we do properly.
                    </p>
                </div>

                {/* ── Featured ────────────────────────────────────────── */}
                <article className="mt-12 grid grid-cols-1 gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-14">
                    <div className="photo-frame order-1 aspect-[4/3] lg:order-none lg:col-span-7 lg:aspect-[16/11]">
                        <img
                            src={FEATURED_SERVICE.image}
                            alt="A diagnostic laptop connected to a car, logging live data from the engine management system"
                            className="photo"
                            loading="lazy"
                        />
                    </div>

                    <div className="order-2 lg:order-none lg:col-span-5 lg:pt-2">
                        <div className="flex items-baseline gap-3">
                            <h3 className="display-md">{FEATURED_SERVICE.name}</h3>
                            <span className="spec-label text-clay-ink">Most booked</span>
                        </div>

                        <p className="mt-5 max-w-[60ch] text-[1.0625rem] leading-relaxed text-ink-soft">
                            {FEATURED_SERVICE.summary}
                        </p>

                        <ul className="mt-7 space-y-0">
                            {FEATURED_SERVICE.includes?.map(item => (
                                <li
                                    key={item}
                                    className="border-t border-line-soft py-2.5 text-[0.9375rem] text-ink-soft last:border-b"
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <div className="mt-7 flex items-end gap-10">
                            <div>
                                <p className="spec-label">From</p>
                                <p className="stat mt-1 text-[1.5rem]">
                                    {FEATURED_SERVICE.from}
                                </p>
                            </div>
                            <div>
                                <p className="spec-label">Typical time</p>
                                <p className="stat mt-1 text-[1.5rem]">
                                    {FEATURED_SERVICE.duration}
                                </p>
                            </div>
                        </div>

                        <Link to="/contact" className="link-cta mt-8">
                            Book a diagnostic
                        </Link>
                    </div>
                </article>

                {/* ── Two mid-weight services ─────────────────────────── */}
                <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:mt-20 lg:gap-12">
                    {[midA, midB].map(service => (
                        <article key={service.slug} className="flex flex-col">
                            <div className="photo-frame aspect-[16/10]">
                                <img
                                    src={service.image}
                                    alt=""
                                    className="photo"
                                    loading="lazy"
                                />
                            </div>
                            <h3 className="title-lg mt-5">{service.name}</h3>
                            <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-muted">
                                {service.summary}
                            </p>
                            <p className="spec-value mt-4 pt-1 text-ink-soft sm:mt-auto">
                                {service.from}
                                <span className="spec-label ml-2.5">{service.duration}</span>
                            </p>
                        </article>
                    ))}
                </div>

                {/* ── Three supporting services, typography only ──────── */}
                {/* Three-up from 1024px. At 768px three of these shared
                    688px, which left each about 190px — technically fitting,
                    visibly cramped. */}
                <div className="mt-16 grid grid-cols-1 gap-x-10 border-t border-ink pt-2 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-x-12">
                    {rest.map(service => (
                        <article
                            key={service.slug}
                            className="flex flex-col border-b border-line py-7 sm:border-b-0 sm:py-8"
                        >
                            <h3 className="title-lg">{service.name}</h3>
                            <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-muted">
                                {service.summary}
                            </p>
                            <p className="spec-value mt-4 pt-1 text-ink-soft sm:mt-auto">
                                {service.from}
                                <span className="spec-label ml-2.5">{service.duration}</span>
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
