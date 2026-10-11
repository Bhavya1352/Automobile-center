import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { AI_EXAMPLE } from '../data/homeData';

/**
 * AI vehicle check — presented as a working tool, with a real worked
 * example and an honest account of its limits. No orb, no chat
 * bubbles, no avatars. The panel looks like the product it describes.
 */
const AiCheck: React.FC = () => (
    <section id="ai-check" className="section scroll-mt-20">
        <div className="wrap">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">

                {/* ── Explanation ─────────────────────────────────── */}
                <div className="lg:col-span-5 lg:pt-4">
                    <h2 className="display-lg">
                        Know what your
                        <br className="hidden sm:block" /> car needs.
                    </h2>

                    <p className="lede mt-6">
                        Most people cannot describe a fault in the language of a service
                        menu. Describe the symptom in your own words instead — the noise,
                        when it happens, what it feels like.
                    </p>

                    <p className="mt-5 text-[0.9375rem] leading-relaxed text-muted">
                        The check reads your answer against your car&apos;s own service
                        history and the faults common to that model and mileage, then tells
                        you which service is likely relevant and how urgent it is. If you
                        book, the whole exchange goes to the technician, so they have read
                        it before the car arrives.
                    </p>

                    <dl className="mt-9 border-t border-line">
                        <div className="flex gap-6 border-b border-line py-4">
                            <dt className="spec-label w-28 shrink-0 pt-0.5">It does</dt>
                            <dd className="text-[0.9375rem] leading-relaxed text-ink-soft">
                                Narrow the likely area, flag urgency, and point to the right service.
                            </dd>
                        </div>
                        <div className="flex gap-6 border-b border-line py-4">
                            <dt className="spec-label w-28 shrink-0 pt-0.5">It does not</dt>
                            <dd className="text-[0.9375rem] leading-relaxed text-ink-soft">
                                Replace a physical inspection, or price a repair it has not seen.
                            </dd>
                        </div>
                    </dl>
                </div>

                {/* ── Worked example ──────────────────────────────── */}
                <div className="lg:col-span-7">
                    <div className="panel overflow-hidden">

                        {/* Tool header */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-sand px-5 py-3 sm:px-6">
                            <span className="spec-label text-ink-soft">AI vehicle check</span>
                            <span className="meta text-[0.75rem]">
                                {AI_EXAMPLE.vehicle}
                            </span>
                        </div>

                        <div className="px-5 py-6 sm:px-7 sm:py-7">

                            {/* What the owner said */}
                            <p className="spec-label">You described</p>
                            <p className="quote-serif mt-2.5">
                                &ldquo;{AI_EXAMPLE.question}&rdquo;
                            </p>

                            <hr className="rule my-6" />

                            {/* Assessment */}
                            <p className="spec-label">Likely cause</p>
                            <p className="mt-2.5 text-[1rem] leading-relaxed text-ink-soft">
                                {AI_EXAMPLE.answer}
                            </p>

                            {/* Why it thinks so — this is what makes it credible */}
                            <p className="spec-label mt-6">Based on</p>
                            <ul className="mt-2.5 space-y-1.5">
                                {AI_EXAMPLE.basis.map(item => (
                                    <li
                                        key={item}
                                        className="flex gap-2.5 text-[0.8125rem] leading-relaxed text-muted"
                                    >
                                        <span className="text-line-strong" aria-hidden="true">—</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            {/* Urgency */}
                            <div className="mt-6 border-l-2 border-clay bg-clay-pale px-4 py-3">
                                <p className="spec-label text-clay-ink">Urgency</p>
                                <p className="mt-0.5 text-[0.9375rem] font-medium text-ink">
                                    {AI_EXAMPLE.urgency}
                                </p>
                            </div>
                        </div>

                        {/* Recommended next step — the hand-off into booking */}
                        <div className="flex flex-col gap-4 border-t border-line bg-forest px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                            <div>
                                <p className="spec-label text-paper/75">Recommended next step</p>
                                <p className="mt-1 text-[1.25rem] font-semibold tracking-[-0.014em] text-paper">
                                    {AI_EXAMPLE.nextStep}
                                </p>
                                <p className="mt-0.5 text-[0.75rem] font-medium tabular-nums text-paper/75">
                                    {AI_EXAMPLE.nextStepMeta}
                                </p>
                            </div>
                            <Link to="/contact" className="btn btn-on-dark shrink-0">
                                Book it
                                <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
                            </Link>
                        </div>
                    </div>

                    {/* The disclaimer belongs with the tool, not in a footnote */}
                    <p className="mt-4 text-[0.8125rem] leading-relaxed text-muted">
                        This is an AI-assisted recommendation based on what you describe and
                        your service history — not a mechanical diagnosis. A technician
                        confirms the cause on the car before any work is quoted or carried out.
                    </p>
                </div>
            </div>
        </div>
    </section>
);

export default AiCheck;
