import React from 'react';
import { PHOTOS, TRUST_SIGNALS } from '../data/homeData';

/**
 * Trust — a statement, a photograph and a numbered list of
 * commitments. Carried by type and image; nothing here is a card.
 */
const Trust: React.FC = () => (
    <section className="section">
        <div className="wrap">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">

                {/* Left rail — statement and photograph */}
                <div className="lg:col-span-5">
                    <h2 className="display-lg">
                        The part most
                        <br className="hidden sm:block" /> garages skip
                    </h2>
                    <p className="lede mt-6">
                        Telling you what is actually wrong, what it will cost, and what
                        can wait until next time.
                    </p>

                    <div className="photo-frame mt-9 aspect-[5/4] lg:mt-12">
                        <img
                            src={PHOTOS.hands}
                            alt="A technician's hands working on an engine with a spanner"
                            className="photo"
                            loading="lazy"
                        />
                    </div>
                </div>

                {/* Right rail — the commitments */}
                <div className="lg:col-span-6 lg:col-start-7">
                    <ol className="border-t border-ink">
                        {TRUST_SIGNALS.map((signal, i) => (
                            <li key={signal.title} className="border-b border-line py-7">
                                <div className="flex gap-5 sm:gap-7">
                                    <span className="spec-label shrink-0 pt-2 tabular-nums">
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                    <div>
                                        <h3 className="title-lg">{signal.title}</h3>
                                        <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-muted">
                                            {signal.body}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </div>
    </section>
);

export default Trust;
