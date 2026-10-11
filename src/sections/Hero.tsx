import React from 'react';
import { Link } from 'react-router-dom';
import { HERO_FACTS, PHOTOS } from '../data/homeData';
import { cn } from '../lib/cn';

/**
 * Hero — asymmetric. Type holds the left six columns of the page
 * grid; the photograph bleeds off the right edge of the viewport.
 * On narrow screens the two stack and the image becomes a band.
 */
const Hero: React.FC = () => (
    <>
    <section className="relative">

        {/* Photograph — edge-bleed on desktop, stacked band on mobile */}
        <div
            className="
                relative h-[58vw] max-h-[420px] min-h-[260px] w-full overflow-hidden bg-sand
                lg:absolute lg:inset-y-0 lg:right-0 lg:h-full lg:max-h-none lg:w-[47vw]
            "
        >
            <img
                src={PHOTOS.hero}
                alt="A technician working under the open bonnet of a saloon car in a service bay"
                className="photo"
                fetchPriority="high"
            />
        </div>

        <div className="wrap relative">
            <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className="col-span-1 pb-14 pt-12 lg:col-span-6 lg:pb-24 lg:pt-28 xl:col-span-6">

                    <h1 className="display-xl">
                        Precision service.
                        <br />
                        <span className="text-forest">Built for the road ahead.</span>
                    </h1>

                    <p className="lede mt-7 max-w-[34rem]">
                        An independent service centre in Mumbai for owners who want the
                        diagnosis explained, the parts named and the price agreed before
                        the spanner comes out.
                    </p>

                    <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
                        <Link to="/contact" className="btn btn-solid">
                            Book a service
                        </Link>
                        <a href="#how-it-works" className="link-cta">
                            See how it works
                        </a>
                    </div>

                    <p className="mt-8 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm text-muted">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-forest" aria-hidden="true" />
                        Open today until 19:00
                        <span className="text-line-strong" aria-hidden="true">·</span>
                        Andheri East, Mumbai
                        <span className="text-line-strong" aria-hidden="true">·</span>
                        Bosch-certified
                    </p>
                </div>
            </div>
        </div>

    </section>

    {/* Technical facts — a measured band, not four cards. Kept outside
        the hero so the edge-bleed photograph never runs behind it. */}
    <section className="wrap">
            <dl className="grid grid-cols-2 border-t border-line lg:grid-cols-4">
                {HERO_FACTS.map((fact, i) => (
                    <div
                        key={fact.label}
                        className={cn(
                            'py-6 lg:py-7',
                            // Vertical hairlines between columns, not boxes around them
                            i % 2 === 1 ? 'border-l border-line pl-5' : 'pr-5',
                            'lg:border-l lg:pl-6 lg:pr-6',
                            i === 0 ? 'lg:border-l-0 lg:pl-0' : '',
                            i < 2 ? 'border-b border-line lg:border-b-0' : '',
                        )}
                    >
                        <dt className="spec-label">{fact.label}</dt>
                        <dd className="stat mt-1.5 text-[1.75rem]">
                            {fact.value}
                        </dd>
                    </div>
                ))}
            </dl>
    </section>
    </>
);

export default Hero;
