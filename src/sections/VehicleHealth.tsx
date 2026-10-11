import React from 'react';
import { HEALTH_EXAMPLE, PHOTOS } from '../data/homeData';

/**
 * Vehicle health — modelled on a workshop inspection sheet rather
 * than an analytics dashboard: a record with fields, a status column
 * and a list of what is due. No donut charts, no score out of 100.
 */

const STATE: Record<string, { label: string; dot: string; text: string }> = {
    good: { label: 'Good', dot: 'bg-forest', text: 'text-forest' },
    watch: { label: 'Monitor', dot: 'bg-faint', text: 'text-muted' },
    attention: { label: 'Attention', dot: 'bg-clay', text: 'text-clay-ink' },
};

const PRIORITY: Record<string, string> = {
    high: 'text-clay-ink',
    medium: 'text-ink-soft',
    low: 'text-muted',
};

const VehicleHealth: React.FC = () => {
    const v = HEALTH_EXAMPLE;

    return (
        <section className="section bg-sand">
            <div className="wrap">

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
                    <h2 className="display-lg lg:col-span-6">
                        Every reading, kept
                    </h2>
                    <p className="max-w-[58ch] text-[0.9375rem] leading-relaxed text-muted lg:col-span-5 lg:col-start-8 lg:pb-1.5">
                        What we measured, when we measured it, and what is due next —
                        held against your car rather than buried in a paper invoice.
                    </p>
                </div>

                <div className="mt-12 grid grid-cols-1 items-start gap-8 lg:mt-14 lg:grid-cols-12 lg:gap-10">

                    {/* ── The record ──────────────────────────────── */}
                    <div className="panel lg:col-span-8">

                        {/* Record header */}
                        <div className="flex flex-col gap-5 border-b border-line px-5 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-7 sm:py-6">
                            <div>
                                <h3 className="title-lg">{v.vehicle}</h3>
                                <p className="meta mt-1">
                                    {v.plate} · {v.year}
                                </p>
                            </div>
                            <div className="flex gap-8 sm:text-right">
                                <div>
                                    <p className="spec-label">Odometer</p>
                                    <p className="spec-value mt-1">{v.odometer} km</p>
                                </div>
                                <div>
                                    <p className="spec-label">Last service</p>
                                    <p className="spec-value mt-1">{v.lastService}</p>
                                </div>
                            </div>
                        </div>

                        {/* System-by-system — an inspection sheet */}
                        <div className="px-5 py-2 sm:px-7">
                            <table className="w-full border-collapse text-left">
                                <caption className="sr-only">
                                    System-by-system inspection results
                                </caption>
                                <thead>
                                    <tr>
                                        <th scope="col" className="spec-label py-3 font-normal">System</th>
                                        <th scope="col" className="spec-label hidden py-3 font-normal sm:table-cell">
                                            Technician note
                                        </th>
                                        <th scope="col" className="spec-label py-3 text-right font-normal">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {v.systems.map(system => {
                                        const s = STATE[system.state];
                                        return (
                                            <tr key={system.name} className="border-t border-line-soft">
                                                <th
                                                    scope="row"
                                                    className="py-3.5 pr-4 align-top text-[0.9375rem] font-medium text-ink"
                                                >
                                                    {system.name}
                                                    <span className="mt-0.5 block text-[0.8125rem] font-normal text-muted sm:hidden">
                                                        {system.note}
                                                    </span>
                                                </th>
                                                <td className="hidden py-3.5 pr-4 align-top text-[0.875rem] text-muted sm:table-cell">
                                                    {system.note}
                                                </td>
                                                <td className="py-3.5 align-top text-right whitespace-nowrap">
                                                    <span className={`inline-flex items-center gap-2 text-[0.8125rem] font-medium ${s.text}`}>
                                                        <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} aria-hidden="true" />
                                                        {s.label}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <p className="border-t border-line px-5 py-3.5 text-[0.75rem] font-medium text-muted sm:px-7">
                            {v.lastServiceType}
                        </p>
                    </div>

                    {/* ── What is due ─────────────────────────────── */}
                    <div className="lg:col-span-4">
                        <div className="panel px-5 py-5 sm:px-6">
                            <p className="spec-label">Due next</p>
                            <ul className="mt-3">
                                {v.upcoming.map(item => (
                                    <li
                                        key={item.task}
                                        className="flex items-baseline justify-between gap-4 border-t border-line-soft py-3 first:border-t-0 first:pt-0"
                                    >
                                        <span className={`text-[0.9375rem] font-medium ${PRIORITY[item.priority]}`}>
                                            {item.task}
                                        </span>
                                        <span className="shrink-0 text-[0.75rem] font-medium tabular-nums text-muted">
                                            {item.due}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-5 border-t border-line pt-4">
                                <p className="spec-label">Next scheduled service</p>
                                <p className="spec-value mt-1">{v.nextDue}</p>
                            </div>
                        </div>

                        <div className="photo-frame mt-8 hidden aspect-[4/3] lg:block">
                            <img
                                src={PHOTOS.suspension}
                                alt="Front suspension and brake assembly of a car with the wheel removed"
                                className="photo"
                                loading="lazy"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VehicleHealth;
