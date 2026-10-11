import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

/** URL-safe form of a tab label: "My Vehicles" -> "my-vehicles". */
export const tabSlug = (label: string) => label.toLowerCase().replace(/\s+/g, '-');

/**
 * useTabParam — keeps the open dashboard section in the URL.
 *
 * The same reasoning as useFilterParams: a section worth opening is
 * worth linking to. It also means the browser's back button steps
 * between sections instead of leaving the dashboard entirely, which is
 * what people expect of a tab bar deep inside an application.
 *
 * An unknown or missing `?tab=` falls back to the first section rather
 * than rendering nothing.
 */
export function useTabParam(labels: readonly string[]): [string, (label: string) => void] {
    const [searchParams, setSearchParams] = useSearchParams();

    const requested = searchParams.get('tab');
    const active = labels.find(l => tabSlug(l) === requested) ?? labels[0];

    const setActive = useCallback((label: string) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            // The default section stays out of the URL, so the bare
            // dashboard link is the clean one.
            if (tabSlug(label) === tabSlug(labels[0])) next.delete('tab');
            else next.set('tab', tabSlug(label));
            return next;
        });
    }, [labels, setSearchParams]);

    return [active, setActive];
}

/**
 * Spread onto the element that renders the active section's content, so
 * the panel is announced as belonging to the selected tab. Lives beside
 * the tab state rather than in the component file, which keeps that file
 * exporting components only.
 */
export const dashboardPanelProps = (idPrefix: string, active: string) => ({
    role: 'tabpanel' as const,
    id: `${idPrefix}-panel-${tabSlug(active)}`,
    'aria-labelledby': `${idPrefix}-tab-${tabSlug(active)}`,
    tabIndex: -1,
});
