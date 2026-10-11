import React, { useEffect, useRef } from 'react';
import { tabSlug } from '../../hooks/useTabParam';
import { cn } from '../../lib/cn';

export interface DashboardTab {
    icon: React.ComponentType<{ size?: number | string; className?: string }>;
    label: string;
}

interface DashboardTabsProps {
    tabs: readonly DashboardTab[];
    active: string;
    onChange: (label: string) => void;
    /** Primary actions pinned to the end of the bar. */
    actions?: React.ReactNode;
    /** Prefixes the generated tab and panel ids. */
    idPrefix: string;
}

/**
 * DashboardTabs — the ARIA tabs pattern, not a row of buttons.
 *
 * Only the selected tab is in the tab sequence (roving tabindex), so
 * Tab moves past the bar in one press and Left/Right, Home and End
 * move between sections — what a keyboard user expects of a tablist,
 * and what six Tab presses to reach the content is not.
 *
 * Each tab is linked to the panel it controls; the panel itself is
 * rendered by the page, which spreads `dashboardPanelProps` onto it.
 */
export const DashboardTabs: React.FC<DashboardTabsProps> = ({
    tabs, active, onChange, actions, idPrefix,
}) => {
    const barRef = useRef<HTMLDivElement>(null);

    // The bar scrolls horizontally on narrow screens, so a tab restored
    // from the URL (?tab=settings) could start out of view with nothing
    // to suggest the strip scrolls at all.
    useEffect(() => {
        barRef.current
            ?.querySelector<HTMLElement>(`#${idPrefix}-tab-${tabSlug(active)}`)
            ?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }, [active, idPrefix]);

    const move = (delta: number) => {
        const index = tabs.findIndex(t => t.label === active);
        const next = tabs[(index + delta + tabs.length) % tabs.length];
        onChange(next.label);
        // Follow focus, as the pattern requires for automatic activation.
        barRef.current
            ?.querySelector<HTMLElement>(`#${idPrefix}-tab-${tabSlug(next.label)}`)
            ?.focus();
    };

    const focusEdge = (edge: 'first' | 'last') => {
        const target = edge === 'first' ? tabs[0] : tabs[tabs.length - 1];
        onChange(target.label);
        barRef.current
            ?.querySelector<HTMLElement>(`#${idPrefix}-tab-${tabSlug(target.label)}`)
            ?.focus();
    };

    const onKeyDown = (event: React.KeyboardEvent) => {
        switch (event.key) {
            case 'ArrowRight': event.preventDefault(); move(1); break;
            case 'ArrowLeft': event.preventDefault(); move(-1); break;
            case 'Home': event.preventDefault(); focusEdge('first'); break;
            case 'End': event.preventDefault(); focusEdge('last'); break;
            default: break;
        }
    };

    return (
        <div className="sticky top-[72px] z-20 border-b border-line bg-paper">
            <div className="mx-auto max-w-7xl px-4">
                <div className="flex items-center gap-1">
                    <div
                        ref={barRef}
                        role="tablist"
                        aria-label="Dashboard sections"
                        onKeyDown={onKeyDown}
                        className="scrollbar-hide -mb-px flex min-w-0 flex-1 items-center gap-1 overflow-x-auto"
                    >
                        {tabs.map(tab => {
                            const selected = tab.label === active;
                            const slug = tabSlug(tab.label);
                            return (
                                <button
                                    key={tab.label}
                                    type="button"
                                    role="tab"
                                    id={`${idPrefix}-tab-${slug}`}
                                    aria-selected={selected}
                                    aria-controls={`${idPrefix}-panel-${slug}`}
                                    tabIndex={selected ? 0 : -1}
                                    onClick={() => onChange(tab.label)}
                                    className={cn(
                                        'flex flex-shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-3 py-3.5 text-sm font-medium transition-colors sm:px-4',
                                        selected
                                            ? 'border-primary text-primary'
                                            : 'border-transparent text-muted hover:text-ink',
                                    )}
                                >
                                    <tab.icon size={15} className="shrink-0" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                    {actions && (
                        <div className="hidden flex-shrink-0 items-center gap-2 py-2 pl-4 md:flex">
                            {actions}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
