import React from 'react';

interface PageHeroProps {
    /** Short category word, e.g. "Careers". Rendered as a line of
     *  breadcrumb-weight text, not a pill. */
    badge: string;
    title: React.ReactNode;
    subtitle: string;
    /** Accepted for compatibility with existing callers; not rendered.
     *  Decorative icons were removed in the redesign. */
    icon?: React.ReactNode;
    breadcrumb?: string[];
}

/**
 * PageHero — the masthead for interior pages. Left-aligned, set on
 * the page grid, closed by a rule. Replaces the previous centred
 * composition with its badge pill, glow orbs and accent underline.
 */
const PageHero: React.FC<PageHeroProps> = ({ badge, title, subtitle, breadcrumb }) => (
    <section className="wrap pb-10 pt-14 lg:pb-14 lg:pt-20">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
            <div className="lg:col-span-7">
                {(breadcrumb?.length ? breadcrumb : [badge]).length > 0 && (
                    <p className="spec-label">
                        {(breadcrumb?.length ? breadcrumb : [badge]).join('  /  ')}
                    </p>
                )}
                <h1 className="display-lg mt-3">{title}</h1>
            </div>

            <p className="text-[0.9375rem] leading-relaxed text-muted lg:col-span-5 lg:pb-1.5">
                {subtitle}
            </p>
        </div>

        <hr className="rule mt-10 lg:mt-14" />
    </section>
);

export default PageHero;
