/**
 * Display formatters.
 *
 * Centralised because a figure that reads "₹11,480" in one panel and
 * "Rs 11480" in the next makes a product look assembled rather than
 * designed. Indian digit grouping (1,14,800) is the local convention,
 * so the rupee formatter uses the en-IN locale rather than en-US.
 */

const RUPEES = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
});

const KM = new Intl.NumberFormat('en-IN');

const DATE_LONG = new Intl.DateTimeFormat('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
});

const DATE_SHORT = new Intl.DateTimeFormat('en-IN', {
    day: 'numeric', month: 'short',
});

export const formatRupees = (amount: number) => RUPEES.format(amount);

/** Compact form for headline figures: ₹1.4L, ₹8.4L, ₹12.6L. */
export function formatRupeesCompact(amount: number): string {
    if (amount >= 10_000_000) return `₹${(amount / 10_000_000).toFixed(1)}Cr`;
    if (amount >= 100_000) return `₹${(amount / 100_000).toFixed(1)}L`;
    if (amount >= 1_000) return `₹${Math.round(amount / 1_000)}k`;
    return formatRupees(amount);
}

export const formatKm = (km: number) => `${KM.format(km)} km`;

/** ISO date → "18 Mar 2026". Returns an em dash for a missing date, so
 *  a table cell never renders the word "null". */
export function formatDate(iso: string | null): string {
    if (!iso) return '—';
    const date = new Date(iso);
    return Number.isNaN(date.getTime()) ? '—' : DATE_LONG.format(date);
}

export function formatDateShort(iso: string | null): string {
    if (!iso) return '—';
    const date = new Date(iso);
    return Number.isNaN(date.getTime()) ? '—' : DATE_SHORT.format(date);
}

/** Today in the `yyyy-mm-dd` form a date input expects, in local time —
 *  `toISOString()` would shift back a day for anyone east of UTC. */
export function todayInputValue(): string {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60_000;
    return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

/**
 * "Today", "Yesterday", "In 4 days", "12 days ago".
 *
 * Dashboards are read at a glance, and "in 4 days" is understood
 * faster than a date the reader has to compare against today. Beyond a
 * fortnight the actual date is more useful than a running count, so it
 * falls back to one.
 */
export function formatRelativeDay(iso: string | null): string {
    if (!iso) return '—';
    const then = new Date(iso);
    if (Number.isNaN(then.getTime())) return '—';

    // Compared at day boundaries, not by elapsed hours: a booking made
    // last night is "yesterday", not "14 hours ago".
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const startOfThen = new Date(then);
    startOfThen.setHours(0, 0, 0, 0);

    const days = Math.round((startOfThen.getTime() - startOfToday.getTime()) / 86_400_000);

    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    if (days === -1) return 'Yesterday';
    if (days > 1 && days <= 14) return `In ${days} days`;
    if (days < -1 && days >= -14) return `${Math.abs(days)} days ago`;
    return formatDate(iso);
}
